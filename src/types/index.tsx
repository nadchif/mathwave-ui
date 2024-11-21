export type TLevel = 'easy' | 'medium' | 'hard';

type TOperator = '+' | '-' | 'x' | '/';

export type TRating = 1 | 2 | 3;

export type TGameSettings = {
  timeOut: number;
  maxQuestions: number;
  starRating: Record<TRating, number>;
  operators: TOperator[];
  numbers: number[];
  maxResult: number;
};

export type TConfig = {
  sampleRate: number;
  gameName: string;
  socketUrl: string;
  apiUrl: string;
  gameSettings: Record<TLevel, TGameSettings>;
  isDevelopmentEnv: boolean;
  detectionEngine: 'browser' | 'assemblyAiProxy' | 'assemblyAi';
};

export type TQuestion = {
  number1: number;
  number2: number;
  operator: TOperator;
  result: number;
};

export type TScreen = 'start' | 'game' | 'gameOver';

export type TResult = {
  transcript: string;
  confidence: number;
  latest: string;
  isFinal: boolean;
};

export type TResultHandler = (result: TResult) => void;

export type TAssemblyAiRecognition = {
  message_type: 'PartialTranscript' | 'FinalTranscript';
  created: string;
  audio_start: number;
  audio_end: number;
  confidence: number;
  text: string;
};

export enum EError {
  NO_MICROPHONE_ACCESS = 'NO_MICROPHONE_ACCESS',
  RECOGNITION_SERVER_ERROR = 'RECOGNITION_SERVER_ERROR',
  WEB_SOCKET_CLOSED = 'WEB_SOCKET_CLOSED',
}

export type TSoundEffect = 'correct' | 'wrong' | 'timeUp' | 'gameOver';
