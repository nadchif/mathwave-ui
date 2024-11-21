import { motion } from 'framer-motion';

type Props = {
  checked?: boolean;
  onChange?: () => void;
};

export default function ToggleButton({ checked, onChange }: Props) {
  return (
    <div className="relative w-12 h-6 cursor-pointer " onClick={onChange}>
      <motion.div
        whileHover={{ scale: 1.2 }}
        className={`absolute inset-0 rounded-full ${checked ? 'bg-gameSecondary' : 'bg-gray-300'}`}
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-gamePrimary rounded-full shadow-lg"
        layout
        initial={false}
        animate={{
          x: checked ? 24 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
