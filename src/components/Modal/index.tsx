import { motion } from 'framer-motion';
import type React from 'react';

type Props = {
  children: React.ReactNode;
  fullHeight?: boolean;
};

function Modal({ children, fullHeight }: Props) {
  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      className="h-screen w-screen bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center">
      <div className="flex w-full justify-center">
        <motion.div
          className={`relative p-6 w-full max-w-xl ${fullHeight ? 'h-full' : ''} `}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}>
          <div className="relative mx-auto  p-4 bg-gamePrimary h-full rounded-lg shadow sm:p-5">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export default Modal;
