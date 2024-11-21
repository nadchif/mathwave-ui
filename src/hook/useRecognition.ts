import { useEffect, useMemo, useRef, useState } from 'react';
import { ToWords } from 'to-words';

import { EError, type TAssemblyAiRecognition, type TResultHandler } from '../types';
import config from '../config';
import { showAlertModal } from '../components/modals/Alert';
import logger from '../util/logger';
import { RealtimeTranscriber } from 'assemblyai/streaming';
import * as RecordRTC from 'recordrtc';

type BaseProps = {
  onSoundDetected?: () => void;
  onResult: TResultHandler;
  onError?: (e: unknown) => void;
};

type Props =
  | (BaseProps & {
      api: 'browser';
      audioStream?: MediaStream | null;
    })
  | (BaseProps & {
      api: 'assemblyAiProxy' | 'assemblyAi';
      audioStream: MediaStream | null;
    });

const RECORDER_BASE_OPTIONS: RecordRTC.Options = {
  type: 'audio',
  mimeType: 'audio/webm;codecs=pcm',
  recorderType: RecordRTC.StereoAudioRecorder,
  timeSlice: 250,
  desiredSampRate: 16000,
  numberOfAudioChannels: 1,
  bufferSize: 2048,
  audioBitsPerSecond: 128000,
};

const app = window;
const SpeechRecognition = app.SpeechRecognition || app.webkitSpeechRecognition;
const SpeechGrammarList = app.SpeechGrammarList || app.webkitSpeechGrammarList;

const toWords = new ToWords({
  localeCode: 'en-US',
});

const getLastWord = (text: string) => {
  if (text.includes(' ')) {
    return text.split(' ').pop() || '';
  }
  return text;
};

function useRecognition({ api, onResult, onError, onSoundDetected, audioStream }: Props) {
  const lastDetectedTextRef = useRef<string>('');
  const browserRecognitionRef = useRef<typeof SpeechRecognition>();
  const isRecognizingRef = useRef(false);
  const previousFinalBrowserTranscriptRef = useRef<string>('');
  const realtimeTranscriber = useRef<RealtimeTranscriber | null>();
  const recorder = useRef<RecordRTC.StereoAudioRecorder | null>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (api === 'assemblyAi') {
      const initTranscription = async () => {
        logger.info('Using recognition via AssemblyAI');
        if (!audioStream) {
          return;
        }
        const getTemporaryToken = async () => {
          try {
            const response = await fetch(`${config.apiUrl}/token`);
            if (!response.ok || response.status === 429) {
              showAlertModal('How about a break? Please try again after a minute', () => {
                onError?.(new Error(EError.WEB_SOCKET_CLOSED));
              });
              return;
            }
            const data = await response.json();
            if (data.error) {
              throw new Error(data.error);
            }
            return data.token;
          } catch {
            showAlertModal('Failed to connect to the recognition server. Please try again later.', () => {
              onError?.(new Error(EError.WEB_SOCKET_CLOSED));
            });
          }
        };
        const token = await getTemporaryToken();
        if (!token) {
          return;
        }

        realtimeTranscriber.current = new RealtimeTranscriber({
          token,
          sampleRate: 16_000,
        });

        realtimeTranscriber.current.on('error', (event) => {
          logger.error(event);
          realtimeTranscriber.current!.close();
          realtimeTranscriber.current = null;
        });

        realtimeTranscriber.current.on('close', (code, reason) => {
          logger.log(`Connection closed: ${code} ${reason}`);
          realtimeTranscriber.current = null;
        });

        realtimeTranscriber.current.on('transcript', (data) => {
          onResult?.({
            transcript: data.text,
            confidence: data.confidence,
            latest: (data.text.split(' ').pop() || '').trim(),
            isFinal: data.message_type === 'FinalTranscript',
          });
        });

        await realtimeTranscriber.current.connect();
        const audioContext = new AudioContext();
        recorder.current = new RecordRTC.StereoAudioRecorder(audioStream, {
          ...RECORDER_BASE_OPTIONS,
          ondataavailable: async (blob: Blob) => {
            if (!realtimeTranscriber.current) {
              return;
            }
            const buffer = await blob.arrayBuffer();
            realtimeTranscriber.current.sendAudio(buffer);
            audioContext.decodeAudioData(buffer).then((audioBuffer) => {
              const rawData = audioBuffer.getChannelData(0);
              const peak = Math.max(...rawData.map(Math.abs));
              if (peak > 0.02) {
                onSoundDetected?.();
              }
            });
          },
        });
        recorder.current.record();
        setIsReady(true);
      };
      initTranscription();

      return () => {
        realtimeTranscriber.current?.close();
        recorder.current?.pause();
        logger.log('Closed connection to AssemblyAI');
      };
    } else if (api === 'assemblyAiProxy') {
      logger.info('Using recognition via AssembyAI (WebSocket Proxy)');
      let mediaRecorder: MediaRecorder;
      let socket: WebSocket;

      const initUploadStream = async () => {
        if (!audioStream) {
          return;
        }
        socket = new WebSocket(config.socketUrl);
        socket.onopen = () => logger.log('WebSocket connected.');
        socket.onclose = () => logger.log('WebSocket closed.');

        socket.onmessage = (event) => {
          const data: TAssemblyAiRecognition = JSON.parse(event.data);

          onResult?.({
            transcript: data.text,
            confidence: data.confidence,
            latest: (data.text.split(' ').pop() || '').trim(),
            isFinal: data.message_type === 'FinalTranscript',
          });
        };
        socket.onerror = (error) => {
          logger.error('WebSocket error:', error);
          showAlertModal('Failed to connect to the recognition server. Please try again later.', () => {
            onError?.(new Error(EError.WEB_SOCKET_CLOSED));
          });
        };

        const audioContext = new AudioContext();
        recorder.current = new RecordRTC.StereoAudioRecorder(audioStream, {
          ...RECORDER_BASE_OPTIONS,
          ondataavailable: async (blob: Blob) => {
            if (!(socket.readyState === WebSocket.OPEN)) {
              return;
            }
            const buffer = await blob.arrayBuffer();
            socket.send(buffer);
            audioContext.decodeAudioData(buffer).then((audioBuffer) => {
              const rawData = audioBuffer.getChannelData(0);
              const peak = Math.max(...rawData.map(Math.abs));
              if (peak > 0.02) {
                onSoundDetected?.();
              }
            });
          },
        });
        recorder.current.record();

        setIsReady(true);
      };
      initUploadStream();

      return () => {
        mediaRecorder?.stop();
        socket?.close();
      };
    } else if (api === 'browser') {
      logger.info("Using recognition via browser's SpeechRecognition API");
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        logger.warn('SpeechRecognition not supported');
        return;
      }

      browserRecognitionRef.current = new SpeechRecognition();
      const browserRecognition = browserRecognitionRef.current;
      browserRecognition.continuous = true;
      browserRecognition.interimResults = true;
      browserRecognition.lang = 'en-US';
      browserRecognition.maxAlternatives = 2;

      const possibleAnswers = Array.from({ length: 100 }, (_, i) => toWords.convert(i));

      if (SpeechGrammarList) {
        const speechRecognitionList = new SpeechGrammarList();
        const grammar = '#JSGF V1.0; grammar answers; public <answer> = ' + possibleAnswers.join(' | ') + ' ;';
        speechRecognitionList.addFromString(grammar, 1);
        browserRecognition.grammars = speechRecognitionList;
      }

      browserRecognition.onstart = () => {
        logger.log('Recognition started');
        setTimeout(() => setIsReady(true), 1000);
        isRecognizingRef.current = true;
      };

      browserRecognition.onend = () => {
        logger.log('Recognition ended');
        isRecognizingRef.current = false;
      };

      browserRecognition.onsoundstart = () => {
        logger.debug('Sound start');
      };

      browserRecognition.onspeechend = () => {
        logger.log('Speech end');
        onResult({
          transcript: lastDetectedTextRef.current,
          confidence: 1,
          latest: getLastWord(lastDetectedTextRef.current),
          isFinal: true,
        });
        browserRecognition.stop();
      };

      browserRecognition.onresult = (event: Record<string, any>) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        const isFinal = event.results[0].isFinal;

        if (config.isDevelopmentEnv) {
          logger.log(`Transcript (${isFinal ? 'FINAL' : 'PARTIAL'}): |${transcript}|`);
        }

        if (previousFinalBrowserTranscriptRef.current === transcript && isFinal) {
          return;
        }

        onResult({
          transcript,
          confidence: event.results[0][0].confidence,
          latest: transcript.trim() ? getLastWord(transcript) : '',
          isFinal,
        });
        if (isFinal) {
          previousFinalBrowserTranscriptRef.current = transcript;
        }
        lastDetectedTextRef.current = transcript;
      };

      browserRecognition.start();

      return () => {
        if (browserRecognitionRef.current && isRecognizingRef.current) {
          browserRecognitionRef.current.stop();
        }
      };
    } else {
      logger.warn('Invalid Recognition API provided');
    }
  }, [api, audioStream]);

  const actions = useMemo(() => {
    const clearTranscript = () => {
      lastDetectedTextRef.current = '';
    };
    const listen = () => {
      if (browserRecognitionRef.current && !isRecognizingRef.current) {
        try {
          browserRecognitionRef.current.start();
        } catch (e) {
          if (config.isDevelopmentEnv) {
            logger.debug(e);
          }
        }
      }
    };
    return { clearTranscript, listen, isReady };
  }, [isReady]);

  return actions;
}

export default useRecognition;
