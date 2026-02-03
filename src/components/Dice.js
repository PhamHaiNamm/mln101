import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import './Dice.css';

const Dice = () => {
    const { state, rollDice } = useGame();
    const [rolling, setRolling] = useState(false);
    const [showValue, setShowValue] = useState(1);

    const handleRoll = () => {
        if (state.turnStatus !== 'ROLL' || rolling) return;

        setRolling(true);
        // Animate for a bit
        setTimeout(() => {
            const val = rollDice();
            setShowValue(val);
            setRolling(false);
        }, 1000);
    };

    // Use effect to sync dice face if needed, but local state is fine for animation visual

    // Cube rotation classes
    const getFaceClass = (val) => {
        switch (val) {
            case 1: return 'show-1';
            case 2: return 'show-2';
            case 3: return 'show-3';
            case 4: return 'show-4';
            case 5: return 'show-5';
            case 6: return 'show-6';
            default: return 'show-1';
        }
    };

    return (
        <div className="dice-container">
            <div className={`scene ${rolling ? 'rolling-anim' : ''}`}>
                <div className={`cube ${getFaceClass(showValue)}`}>
                    <div className="cube__face cube__face--1">1</div>
                    <div className="cube__face cube__face--2">2</div>
                    <div className="cube__face cube__face--3">3</div>
                    <div className="cube__face cube__face--4">4</div>
                    <div className="cube__face cube__face--5">5</div>
                    <div className="cube__face cube__face--6">6</div>
                </div>
            </div>
            <button
                className="premium-btn roll-btn"
                onClick={handleRoll}
                disabled={state.turnStatus !== 'ROLL' || rolling}
            >
                {rolling ? 'Rolling...' : state.turnStatus === 'ROLL' ? 'ROLL DICE' : `Rolled: ${state.diceValue}`}
            </button>
        </div>
    );
};

export default Dice;
