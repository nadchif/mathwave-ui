import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EError, TGameSettings, TQuestion, TResultHandler } from '../../../types';
import { useGame } from '../../../context/game';
import useRecognition from '../../../hook/useRecognition';
import Question from '../Question';
import Header from '../Header';
import MicVisualizer from '../MicVisualizer';
import GameButton from '../../../components/GameButton';
import useDebounce from '../../../hook/useDebounce';
import { voiceInputToNumber } from '../util';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, MicrophoneIcon, XCircleIcon } from '@heroicons/react/16/solid';
import config from '../../../config';
import LoadingDots from '../LoadingDots';

type Props = {
  questions: TQuestion[];
  settings: TGameSettings;
  onEnd: (score: number) => void;
};

function Round({ questions, settings, onEnd }: Props) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const isScanningRef = useRef(true);
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [userAnswer, setUserAnswer] = useState(' ');
  const debouncedAnswer = useDebounce(userAnswer.trim(), 100);
  const { audioStream, isPaused, setScreen, playSoundEffect } = useGame();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onRecognitionResult = useCallback<TResultHandler>(({ latest }) => {
    if (timeExceeded) {
      setUserAnswer(' ');
      return;
    }
    if (isScanningRef.current && latest) {
      if (latest.includes(' ')) {
        setUserAnswer(latest.split(' ').pop() || ' ');
      } else {
        setUserAnswer(() => latest || ' ');
      }
    }
  }, []);

  const onRecognitionError = useCallback(
    (error: unknown) => {
      // if error is websocket closed, abandon the round
      if (error instanceof Error && error.message === EError.WEB_SOCKET_CLOSED) {
        setScreen('start');
      }
    },
    [setScreen]
  );

  const stopSpeakingAnimationRef = useRef<number | null>(null);

  const { listen, isReady } = useRecognition({
    api: config.detectionEngine,
    audioStream,
    onResult: onRecognitionResult,
    onError: onRecognitionError,
    onSoundDetected: () => {
      setIsSpeaking(true);
      if (stopSpeakingAnimationRef.current) {
        clearTimeout(stopSpeakingAnimationRef.current);
      }
      stopSpeakingAnimationRef.current = window.setTimeout(() => {
        setIsSpeaking(false);
      }, 1000);
    },
  });

  const question = questions[currentQuestion];

  const parsedUserInput = useMemo(() => voiceInputToNumber(debouncedAnswer), [debouncedAnswer]);

  const isCorrect = parsedUserInput === question.result;

  const resetQuestion = (questionNumber?: number) => {
    setTimeExceeded(false);
    setUserAnswer(' ');
    listen();
    isScanningRef.current = true;
    if (!questionNumber) {
      return;
    }
    if (questionNumber >= questions.length) {
      onEnd(score);
      return;
    }
    setCurrentQuestion(questionNumber);
  };

  useEffect(() => {
    const onAnswer = () => {
      setScore((prev) => prev + 1);
      if (currentQuestion + 1 < questions.length) {
        resetQuestion(currentQuestion + 1);
      } else {
        onEnd(score + 1);
      }
    };

    if (isCorrect) {
      isScanningRef.current = false;
      const timeout = setTimeout(onAnswer, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isCorrect]);

  const onSkipClick = () => resetQuestion(currentQuestion + 1);
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gameAccent text-white text-9xl font-bold">
        <motion.div
          key={`${currentQuestion}-${timeExceeded}`}
          className="mt-1 inline-flex gap-2 items-center"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}>
          Go!
        </motion.div>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 justify-between bg-gamePrimary h-screen">
      <Header id={currentQuestion} score={score} onHomeClick={() => setScreen('start')} />
      <Question key={currentQuestion} question={question} />
      <div className="flex flex-col items-center text-white">
        <div className="mt-8 flex justify-center items-end text-4xl text-gameTertiary w-52 gap-2">
          <div>{userAnswer}</div>
          <div>
            {debouncedAnswer ? (
              <>
                {isCorrect ? (
                  <motion.div
                    initial={{ y: 0 }}
                    onAnimationStart={() => playSoundEffect('correct')}
                    animate={{
                      y: [0, -20, 0, -10, 0],
                      transition: {
                        duration: 0.7,
                        ease: 'easeInOut',
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                      },
                    }}>
                    <CheckCircleIcon className="inline-block h-12 text-ellipsis text-gameSecondary" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{
                      x: [-10, 10, -10, 10, 0], // Shake effect
                      transition: {
                        duration: 0.5,
                        ease: 'easeInOut',
                        repeat: 2,
                        repeatDelay: 1,
                      },
                    }}
                    onAnimationComplete={() => {
                      setUserAnswer(' ');
                      resetQuestion();
                    }}>
                    <XCircleIcon className="inline-block h-12  text-gameAccent" />
                  </motion.div>
                )}
              </>
            ) : (
              <div className="h-12 w-12">{isSpeaking && <LoadingDots />}</div>
            )}
          </div>
        </div>
        <div className="w-52 h-1.5 rounded-sm overflow-clip bg-white">
          <motion.div
            key={`${currentQuestion}-${isPaused}`}
            className="h-full bg-gameSecondary"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={isPaused ? { scale: 1, opacity: 1 } : { duration: settings.timeOut, ease: 'linear' }}
            onAnimationComplete={() => {
              if (!isPaused) {
                setTimeExceeded(true);
              }
            }}
          />
        </div>
        <motion.div
          key={`${currentQuestion}-${timeExceeded}`}
          className="mt-1 inline-flex gap-2 items-center"
          animate={{
            scale: [1, timeExceeded ? 2 : 1.1, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
            repeat: timeExceeded ? 3 : Number.POSITIVE_INFINITY,
          }}
          onAnimationStart={() => {
            if (timeExceeded) {
              window.setTimeout(() => resetQuestion(currentQuestion + 1), 1500);
              playSoundEffect('timeUp');
            }
          }}>
          {timeExceeded && !isCorrect ? (
            <>
              <ClockIcon className="h-5" /> Time up!
            </>
          ) : (
            <MicrophoneIcon className="h-5" />
          )}
        </motion.div>
        {timeExceeded ? ' ' : 'Speak'}
      </div>
      <div className="flex justify-center -mt-10">
        <MicVisualizer height={180} />
      </div>
      <div className="flex justify-center">
        <GameButton variant="secondary" onClick={onSkipClick}>
          Skip
        </GameButton>
      </div>
    </div>
  );
}

export default Round;
