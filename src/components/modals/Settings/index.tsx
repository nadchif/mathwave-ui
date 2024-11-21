import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { CodeBracketIcon, HeartIcon, PuzzlePieceIcon, SpeakerWaveIcon, XMarkIcon } from '@heroicons/react/16/solid';

import GameButton from '../../GameButton';
import IconButton from '../../IconButton';
import Modal from '../../Modal';
import ToggleButton from '../../ToggleButton';
import { motion } from 'framer-motion';
import { useGame } from '../../../context/game';
import { TLevel } from '../../../types';
import { GITHUB_URL } from '../../../config';

type Props = {
  onClose?: () => void;
};

const LevelButton = ({ level }: { level: TLevel }) => {
  const { setLevel, level: currentLevel } = useGame();
  return (
    <button
      type="button"
      className={`px-4 py-2 text-gamePrimary ${currentLevel === level ? 'bg-gameSecondary' : 'bg-gameTertiary'} border border-gray-200 rounded hover:bg-gameSecondary `}
      onClick={() => setLevel(level)}>
      {level.toUpperCase()}
    </button>
  );
};
function Settings({ onClose }: Props) {
  const { soundEffects, toggleSoundEffects } = useGame();

  return (
    <Modal>
      <div className="flex justify-between items-center pb-4 mb-4 rounded-t sm:mb-5 ">
        <h3 className="text-xl   text-white">Math Wave</h3>
        <IconButton icon={XMarkIcon} onClick={onClose} />
      </div>
      <div className="text-gamePrimary p-4 mb-3   bg-white rounded-lg flex justify-center flex-col gap-2  ">
        <div className="inline-flex gap-2">
          <PuzzlePieceIcon className="h-6" /> Difficulty
        </div>
        <div>
          <motion.div
            className="inline-flex rounded-md shadow-sm"
            role="group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
            <LevelButton level="easy" />
            <LevelButton level="medium" />
            <LevelButton level="hard" />
          </motion.div>
        </div>
      </div>
      <div className="text-gamePrimary p-4 my-3   bg-white  rounded-lg flex flex-col ">
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <SpeakerWaveIcon className="h-6" /> Sound
          </div>
          <div>
            <ToggleButton checked={soundEffects} onChange={toggleSoundEffects} />
          </div>
        </div>
        <div className="text-xs mt-2 text-gray-500">
          Effects from &nbsp;
          <a
            className="text-gamePrimary underline"
            href="https://www.zapsplat.com/"
            target="_blank"
            rel="noopener noreferrer">
            Zapsplat.com
          </a>
        </div>
        <div className="text-xs mt-2 text-gray-500">
          Music from &nbsp;
          <a
            className="text-gamePrimary underline"
            href="https://pixabay.com/"
            target="_blank"
            rel="noopener noreferrer">
            Pixabay.com
          </a>
        </div>
      </div>
      <div className="text-gamePrimary p-4 my-3   bg-white rounded-lg flex justify-center flex-col gap-2  ">
        <div className="inline-flex gap-2">
          <CodeBracketIcon className="h-6" /> Source Code
        </div>
        <div>
          <GameButton
            variant="secondary"
            size="sm"
            padding="sm"
            onClick={() => {
              window.open(GITHUB_URL, '_blank');
            }}>
            <HeartIcon className="h-6 fill-red-600" /> View on Github
          </GameButton>
        </div>
      </div>
    </Modal>
  );
}

const SettingsModal = NiceModal.create(({ onClose, ...restOfProps }: Props) => {
  const modal = useModal();

  if (!modal.visible) {
    return null;
  }
  return (
    <Settings
      {...restOfProps}
      onClose={() => {
        onClose?.();
        modal.hide();
      }}
    />
  );
});

const showSettingsModal = () => void NiceModal.show(SettingsModal);

export default Settings;

export { showSettingsModal };
