import './index.css';

import NiceModal from '@ebay/nice-modal-react';

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { GameProvider } from './context/game.tsx';

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <NiceModal.Provider>
      <App />
    </NiceModal.Provider>
  </GameProvider>
);
