import { type HTMLMotionProps, motion } from 'framer-motion';
import type React from 'react';

type Props = {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'accent';
  padding?: 'standard' | 'sm';
  size?: 'sm' | 'md' | 'lg';
} & HTMLMotionProps<'button'>;

const styleMap = {
  primary: 'bg-gameSecondary text-white',
  secondary: 'bg-gameTertiary text-gamePrimary',
  accent: 'bg-gameAccent text-gameTertiary',
};

const paddingMap = {
  standard: 'px-12 py-2',
  sm: 'px-3 py-1',
};

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-md',
  md: 'text-3xl',
  lg: 'text-4xl',
};

function GameButton({ children, variant, padding = 'standard', size = 'md', ...restOfProps }: Props) {
  return (
    <motion.button
      className={`my-5 ${paddingMap[padding]} ${sizeMap[size]} rounded-xl ${styleMap[variant]} inline-flex items-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      {...restOfProps}>
      {children}
    </motion.button>
  );
}

export default GameButton;
