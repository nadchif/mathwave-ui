import { motion } from 'framer-motion';

const LoadingDots = () => {
  const dotVariants = {
    animate: (index: number) => ({
      opacity: [0, 0.5, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.4,
      },
    }),
  };

  return (
    <div className="inline-flex  gap-1 justify-center items-center">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          custom={index}
          animate="animate"
          className="w-2.5 h-2.5 bg-white rounded-full"
        />
      ))}
    </div>
  );
};

export default LoadingDots;
