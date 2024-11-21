import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { XMarkIcon } from '@heroicons/react/16/solid';

import GameButton from '../../GameButton';
import IconButton from '../../IconButton';
import Modal from '../../Modal';
import { useGame } from '../../../context/game';
import { useEffect } from 'react';
import config from '../../../config';

type Props = {
  message: string;
  onClose?: () => void;
};

function Alert({ onClose, message }: Props) {
  return (
    <Modal>
      <div className="flex justify-between items-center pb-4 mb-4 rounded-t sm:mb-5 ">
        <h3 className="text-xl text-white">{config.gameName}</h3>
        <IconButton icon={XMarkIcon} onClick={onClose} />
      </div>
      <div className="text-gamePrimary p-4 my-3   bg-white  rounded-lg flex justify-between">{message}</div>
      <div>
        <GameButton variant="primary" onClick={onClose}>
          OK
        </GameButton>
      </div>
    </Modal>
  );
}

const ModalContent = NiceModal.create(({ message, onClose }: Props) => {
  const modal = useModal();
  const { pauseGame, resumeGame } = useGame();

  useEffect(() => {
    if (!modal.visible) {
      return;
    }
    pauseGame();
    return resumeGame;
  }, [modal, pauseGame, resumeGame]);

  if (!modal.visible) {
    return null;
  }

  return (
    <Alert
      message={message}
      onClose={() => {
        onClose?.();
        resumeGame();
        modal.hide();
      }}
    />
  );
});

const showAlertModal = (message: string, callback?: () => void) =>
  void NiceModal.show(ModalContent, {
    message,
    onClose: callback,
  });

export default Alert;

export { showAlertModal };
