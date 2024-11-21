import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGame } from '../../../context/game';

type Props = { onComplete: () => void };

const Countdown = ({ onComplete }: Props) => {
  const { isPaused } = useGame();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0 && !isPaused) {
      const timer = setTimeout(() => {
        if (count === 1) {
          onComplete();
        }
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, isPaused]);

  return (
    <div className="flex items-center justify-center h-screen bg-gameAccent text-white text-9xl font-bold">
      {count > 0 ? (
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}>
          {count}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
          GO!
        </motion.div>
      )}
    </div>
  );
};

export default Countdown;
