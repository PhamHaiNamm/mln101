import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Home from './components/Home';
import Board from './components/Board';
import WinnerScreen from './components/WinnerScreen';
// Board import will be valid once we create it.
// For now, we will create a placeholder.

const GameContainer = () => {
  const { state } = useGame();

  return (
    <div className="App">
      {state.currentPage === 'HOME' && <Home />}
      {state.currentPage === 'GAME' && <Board />}
      {state.gameState === 'FINISHED' && <WinnerScreen />}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
