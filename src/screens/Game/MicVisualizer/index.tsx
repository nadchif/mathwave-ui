import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../../context/game';
import config from '../../../config';
import logger from '../../../util/logger';

const randomFrequencies: number[][] = [];

const getRandomFrequencies = (length: number) => {
  if (randomFrequencies.length < 10) {
    randomFrequencies.push(Array.from({ length }, () => Math.floor(Math.random() * 50)));
    return randomFrequencies[randomFrequencies.length - 1];
  }
  return randomFrequencies[Math.floor(Math.random() * randomFrequencies.length)];
};

const MicVisualizer = ({ height = 200, width = 1000 }: { height?: number; width?: number }) => {
  const { audioStream, createAudioStream } = useGame();
  const [frequencies, setFrequencies] = useState<number[]>(Array(48).fill(0));
  const audioRef = useRef<AnalyserNode | null>(null);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const audioContext = new AudioContext({ sampleRate: config.sampleRate });
        let stream = audioStream;
        if (!stream) {
          stream = await createAudioStream();
        }
        if (!stream) return;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256; // Number of frequency bins
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioRef.current = analyser;

        source.connect(analyser);

        const animate = () => {
          if (audioRef.current) {
            audioRef.current.getByteFrequencyData(dataArray);
            const filteredFrequencies = dataArray.slice(24, 48);

            // Check if there is sound
            const averageAmplitude = filteredFrequencies.reduce((a, b) => a + b, 0) / filteredFrequencies.length;
            if (averageAmplitude > 10) {
              const frequencies = [...filteredFrequencies];
              setFrequencies(frequencies);
            } else {
              const random = getRandomFrequencies(filteredFrequencies.length);
              setFrequencies(random);
            }
          }
          animationId.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        logger.error('Microphone access denied or error:', error);
      }
    };

    setupAudio();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      audioRef.current?.disconnect();
    };
  }, []);

  const createPath = () => {
    const pathData = frequencies
      .map((value, i) => {
        const x = (i / frequencies.length) * (width * 1.05);
        const y = height - (value / height) * (height * 1.1);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
    return `${pathData} L${width},${height} L0,${height} Z`;
  };

  const dPath = createPath() || '';

  return (
    <div
      style={{
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
      }}>
      {dPath && (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%' }}
          xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d={dPath}
            fill={'#009dd7'}
            animate={{
              d: dPath,
            }}
            transition={{
              duration: 0.05,
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4e50" />
              <stop offset="100%" stopColor="#f9d423" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default MicVisualizer;
