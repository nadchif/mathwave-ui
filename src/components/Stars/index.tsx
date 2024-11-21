import { StarIcon } from '@heroicons/react/16/solid';

import type { TRating } from '../../types';

type Props = {
  rating: TRating;
};

function Stars({ rating }: Props) {
  return (
    <div className="flex w-screen justify-center">
      <StarIcon className={'w-16 h-16 py-2 text-gameTertiary'} />
      <StarIcon className={`w-16 h-16 py-1 ${rating > 1 ? 'text-gameTertiary' : 'text-white'}`} />
      <StarIcon className={`w-16 h-16 ${rating > 2 ? 'text-gameTertiary' : 'text-white'}`} />
    </div>
  );
}

export default Stars;
