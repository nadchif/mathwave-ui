import type { TConfig } from './types';

export const GITHUB_URL = 'https://github.com/nadchif/mathwave-ui';

const getDetectionEngine = () => {
  if (import.meta.env.VITE_DETECTION_ENGINE?.toLowerCase() === 'browser') {
    return 'browser';
  } else if (import.meta.env.VITE_DETECTION_ENGINE?.toLowerCase() === 'assemblyaiproxy') {
    return 'assemblyAiProxy';
  } else if (import.meta.env.VITE_DETECTION_ENGINE?.toLowerCase() === 'assemblyai') {
    return 'assemblyAi';
  }
  return 'browser';
};

const config: TConfig = {
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'ws://localhost:4000',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  detectionEngine: getDetectionEngine(),
  sampleRate: 16000,
  isDevelopmentEnv: import.meta.env.DEV,
  gameName: import.meta.env.VITE_GAME_NAME || 'MathWave',
  gameSettings: {
    easy: {
      timeOut: 15,
      maxQuestions: 10,
      starRating: {
        3: 10,
        2: 7,
        1: 0,
      },
      operators: ['+', '-'],
      numbers: Array.from({ length: 11 }, (_, i) => i),
      maxResult: 12,
    },
    medium: {
      timeOut: 10,
      maxQuestions: 12,
      starRating: {
        3: 15,
        2: 10,
        1: 0,
      },
      operators: ['+', '-', 'x'],
      numbers: Array.from({ length: 21 }, (_, i) => i),
      maxResult: 20,
    },
    hard: {
      timeOut: 8,
      maxQuestions: 15,
      starRating: {
        3: 15,
        2: 12,
        1: 0,
      },
      operators: ['+', '-', 'x', '/'],
      numbers: Array.from({ length: 51 }, (_, i) => i),
      maxResult: 50,
    },
  },
} as const;

console.debug('Initiated game with detection engine: ', config.detectionEngine);
export default config;
