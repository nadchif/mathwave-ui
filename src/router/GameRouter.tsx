import { useGame } from '../context/game';
import Game from '../screens/Game';
import Start from '../screens/Start';

function GameRouter() {
  const { screen } = useGame();
  switch (screen) {
    case 'start':
      return <Start />;
    case 'game':
      return <Game />;
    default:
      return null;
  }
}

export default GameRouter;
