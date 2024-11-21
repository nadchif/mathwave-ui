import { motion } from 'framer-motion';
import type React from 'react';

type Props = {
  size?: 'standard' | 'sm';
  variant?: 'primary' | 'error';
  icon: React.ComponentType<{ className?: string }>;
  onClick?: (args?: unknown) => void;
};

const styleMap = {
  primary: 'bg-gameTertiary',
  error: 'bg-gameAccent',
};

const sizeMap = {
  standard: 'h-10',
  sm: 'h-6',
};

function IconButton({ icon: Icon, onClick, size = 'standard', variant = 'primary' }: Props) {
  return (
    <motion.button
      className={`p-2 text-3xl text-white rounded-full ${styleMap[variant]}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      onClick={onClick}>
      <Icon className={`${sizeMap[size]} text-gamePrimary`} />
    </motion.button>
  );
}

export default IconButton;
