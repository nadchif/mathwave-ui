import { motion } from 'framer-motion';

import { type TQuestion } from '../../../types';
type Props = {
  question: TQuestion;
};

function Question({ question }: Props) {
  return (
    <>
      <motion.div
        className="text-white flex flex-col justify-between "
        initial={{ scale: 0.5, opacity: 0.3 }} // Start off-screen to the right
        animate={{ scale: 1, opacity: 1 }} // Animate to center
      >
        <div className="flex justify-center  text-white text-8xl ">
          <div>{question.number1}</div>
          <div>{question.operator.replace('/', '÷')}</div>
          <div>{question.number2}</div>
        </div>
        <div className=" text-white text-8xl text-center ">=</div>
      </motion.div>
    </>
  );
}

export default Question;
