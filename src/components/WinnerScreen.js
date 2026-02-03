import React from 'react';
import { useGame } from '../context/GameContext';
import './WinnerScreen.css';

const WinnerScreen = () => {
    const { state, dispatch } = useGame();

    const handleReset = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    return (
        <div className="winner-overlay">
            <div className="glass-panel winner-content">
                <h1 className="text-gradient">VICTORY!</h1>
                <h2>{state.winner} Wins the Game!</h2>
                <div className="trophy-icon">🏆</div>
                <button className="premium-btn" onClick={handleReset}>Play Again</button>
            </div>
        </div>
    );
};

export default WinnerScreen;
