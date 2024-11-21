import { HomeIcon } from '@heroicons/react/16/solid';

import IconButton from '../../../components/IconButton';
import { useGame } from '../../../context/game';

type Props = {
  id: number;
  score: number;
  onHomeClick: () => void;
};

const Header = ({ id, score, onHomeClick }: Props) => {
  const { level } = useGame();
  return (
    <div className="px-2 py-3 flex justify-between m-3  gap-2 rounded-lg bg-black bg-opacity-50" key={id}>
      <div className="text-gameTertiary inline-flex flex-col items-center gap-0 ">
        <div className="text-xs font-thin text-gray-100  ">Score</div>
        <div className="text-xl text-gameTertiary   p-0">{score || 0}</div>
      </div>
      <div className="text-gameTertiary inline-flex flex-col items-center gap-0 ">
        <div className="text-xs font-thin text-gray-100  ">Level</div>
        <div className="text-xl text-gameTertiary   p-0">{level.toUpperCase()}</div>
      </div>
      <div>
        <IconButton icon={HomeIcon} size="sm" onClick={onHomeClick} />
      </div>
    </div>
  );
};

export default Header;
