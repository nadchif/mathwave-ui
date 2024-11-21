import type React from 'react';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { TLevel, TSoundEffect } from '../types';
import { showAlertModal } from '../components/modals/Alert';
import logger from '../util/logger';

type TScreen = 'start' | 'game';

type GameContextType = {
  screen: TScreen;
  setScreen: (screen: TScreen) => void;
  level: TLevel;
  setLevel: (level: TLevel) => void;
  audioStream: MediaStream | null;
  createAudioStream: () => Promise<MediaStream | null>;
  isPaused: boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  soundEffects: boolean;
  toggleSoundEffects: () => void;
  playSoundEffect: (sound: TSoundEffect) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameMusic = new Audio('/music/music.mp3');
gameMusic.loop = true;

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, _setScreen] = useState<TScreen>('start');
  const [level, setLevel] = useState<TLevel>('easy');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseGame = () => setIsPaused(true);
  const resumeGame = () => setIsPaused(false);
  const [soundEffects, setSoundEffects] = useState(false);

  const setScreen = (screen: TScreen) => {
    if (soundEffects) {
      if (screen === 'start') {
        gameMusic.play();
      } else {
        gameMusic.pause();
      }
    }
    _setScreen(screen);
  };

  const createAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 2,
          sampleRate: 16000,
          sampleSize: 16,
        },
      });
      setAudioStream(stream);
      return stream;
    } catch (error) {
      logger.error(error);
      showAlertModal('Failed to get microphone access. Please enable it to play the game.', () => {
        setScreen('start');
      });
      return null;
    }
  };

  const playSoundEffect = (sound: TSoundEffect, forcePlay?: boolean) => {
    if (soundEffects || forcePlay) {
      const audio = new Audio(`/sounds/${sound}.mp3`);
      audio.play();
      logger.info(`Playing sound effect: ${sound}`);
    }
  };

  useEffect(() => {
    if (screen === 'start' && audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  }, [audioStream, screen]);

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        level,
        setLevel,
        audioStream,
        createAudioStream,
        isPaused,
        pauseGame,
        resumeGame,
        soundEffects,
        toggleSoundEffects: () =>
          setSoundEffects((prev) => {
            if (!prev) {
              gameMusic.play();
            } else {
              gameMusic.pause();
            }
            return !prev;
          }),
        playSoundEffect,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
