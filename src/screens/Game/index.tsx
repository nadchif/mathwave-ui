import { useEffect, useMemo, useState } from 'react';

import config from '../../config';
import { useGame } from '../../context/game';
import type { TGameSettings, TQuestion } from '../../types';
import Countdown from './Countdown';
import Round from './Round';
import GameDone from './GameDone';

const getQuestions = (gameSettings: TGameSettings): TQuestion[] => {
  const questions = [];
  for (let i = 0; i < gameSettings.maxQuestions; i++) {
    const operator = gameSettings.operators[Math.floor(Math.random() * gameSettings.operators.length)];

    let number1: number, number2: number, result: number;

    if (operator === '/') {
      // Ensure no remainder for division
      number2 = gameSettings.numbers[Math.floor(Math.random() * gameSettings.numbers.length)];
      // Avoid zero division
      if (number2 === 0) {
        i--;
        continue;
      }
      const multiplier = Math.floor(Math.random() * (gameSettings.maxResult / number2));
      number1 = number2 * multiplier;
      if (number1 === 0) {
        i--;
        continue;
      }
      result = number1 / number2;
    } else {
      number1 = gameSettings.numbers[Math.floor(Math.random() * gameSettings.numbers.length)];
      number2 = gameSettings.numbers[Math.floor(Math.random() * gameSettings.numbers.length)];
      switch (operator) {
        case '+':
          result = number1 + number2;
          break;
        case '-':
          result = number1 - number2;
          break;
        case 'x':
          result = number1 * number2;
          break;
      }
    }

    const isZeroZero = number1 === 0 && number2 === 0;
    if (result < 0 || result > gameSettings.maxResult || isZeroZero) {
      i--;
      continue;
    }

    questions.push({
      number1,
      number2,
      operator,
      result,
    });
  }
  return questions;
};

function Game() {
  const [subScreen, setSubScreen] = useState<'pre-game' | 'in-game' | 'post-game'>('pre-game');
  const [round, setRound] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const { setScreen, level, playSoundEffect } = useGame();

  const { questions, settings } = useMemo<{
    questions: TQuestion[];
    settings: TGameSettings;
  }>(() => {
    const gameSettings = config.gameSettings[level];
    return {
      questions: getQuestions(gameSettings),
      settings: gameSettings,
      round,
    };
  }, [round]);

  useEffect(() => {
    if (subScreen === 'pre-game') {
      setFinalScore(0);
      setRound((r) => r + 1);
    }
  }, [subScreen]);

  return (
    <div className="bg-gameSecondary w-full">
      {subScreen === 'pre-game' && <Countdown onComplete={() => setSubScreen('in-game')} />}
      {subScreen === 'in-game' && (
        <Round
          questions={questions}
          settings={settings}
          onEnd={(score) => {
            setFinalScore(score);
            setSubScreen('post-game');
            playSoundEffect('gameOver');
          }}
        />
      )}
      {subScreen === 'post-game' && (
        <GameDone
          finalScore={finalScore}
          onHome={() => setScreen('start')}
          onReplay={() => setSubScreen('pre-game')}
          settings={settings}
        />
      )}
    </div>
  );
}

export default Game;
