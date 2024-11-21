import GameRouter from './router/GameRouter';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          Oh no! Something went wrong
          <div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gamePrimary text-white px-4 py-2 mt-4 rounded-lg">
              Reload Page
            </button>
          </div>
        </div>
      }>
      <div className="w-screen flex justify-center bg-black">
        <div className="max-w-5xl relative w-full">
          <GameRouter />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
