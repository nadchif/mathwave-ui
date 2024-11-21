import { Cog6ToothIcon } from '@heroicons/react/16/solid';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player/dist/LottiePlayerLight';

import IconButton from '../../components/IconButton';
import { showSettingsModal } from '../../components/modals/Settings';
import config from '../../config';
import { useGame } from '../../context/game';
import waveAnimation from './assets/waves';
import { showAlertModal } from '../../components/modals/Alert';

function Start() {
  const { setScreen, createAudioStream } = useGame();
  const onStartClick = () => {
    // check for microphone permission
    createAudioStream()
      .then(() => {
        setScreen('game');
      })
      .catch(() => {
        // permission denied
        showAlertModal('You need to enable microphone access to play the game');
      });
  };

  return (
    <div className="bg-gamePrimary h-screen text-white flex flex-col overflow-hidden w-full">
      <div className="flex flex-col items-center justify-center h-3/5">
        <h1 className="text-5xl py-6">{config.gameName}</h1>
        <motion.button
          className="my-20 px-12 py-2 bg-gameSecondary text-3xl text-white rounded-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={onStartClick}>
          Start
        </motion.button>
      </div>
      <div className="h-2/5">
        <Lottie
          animationData={waveAnimation}
          loop
          play
          rendererSettings={{ preserveAspectRatio: 'none' }}
          style={{ width: '100%', height: '40vh' }}
        />
      </div>
      <div className="absolute right-8 bottom-36">
        <IconButton icon={Cog6ToothIcon} onClick={showSettingsModal} />
      </div>
    </div>
  );
}

export default Start;
