import { motion } from 'framer-motion';
import { TGameSettings, TRating } from '../../../types';
import Lottie from 'react-lottie-player/dist/LottiePlayerLight';

import GameButton from '../../../components/GameButton';
import Stars from '../../../components/Stars';
import fireworksAnimation from '../assets/fireworks';

type Props = {
  onReplay: () => void;
  onHome: () => void;
  finalScore: number;
  settings: TGameSettings;
};

function GameDone({ onReplay, onHome, finalScore, settings }: Props) {
  const getHeadingText = () => {
    switch (true) {
      case finalScore === settings.maxQuestions:
        return 'Excellent!';
      case finalScore >= settings.maxQuestions * 0.8:
        return 'Very Good!';
      case finalScore >= settings.maxQuestions * 0.6:
        return 'Good!';
      case finalScore >= settings.maxQuestions * 0.4:
        return 'Okay!';
      default:
        return 'Not bad!';
    }
  };

  const getStarRating = () => {
    let rating: TRating = 1;
    if (finalScore >= settings.starRating[3]) {
      rating = 3;
    } else if (finalScore >= settings.starRating[2]) {
      rating = 2;
    }
    return rating;
  };

  return (
    <motion.div
      className="flex flex-col bg-gameAccent h-screen items-center min-w-0 w-full"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}>
      <div className="text-white text-5xl my-5">{getHeadingText()}</div>
      <div className="relative w-full h-1/3 overflow-clip ">
        <div className="absolute top-0 left-0 right-0">
          <Lottie
            animationData={fireworksAnimation}
            loop
            play
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            style={{ width: '100%', height: '50vh' }}
          />
        </div>
        <div className="absolute w-full flex flex-col items-center min-w-0 ">
          <div>
            <Stars rating={getStarRating()} />
          </div>
          <div className="text-white text-2xl my-5 text-center">Score: {finalScore}</div>
        </div>
      </div>
      <GameButton variant="secondary" onClick={onReplay}>
        Replay
      </GameButton>
      <GameButton variant="secondary" onClick={onHome}>
        Home
      </GameButton>
    </motion.div>
  );
}

export default GameDone;
