import React from 'react';
import { useGame } from '../context/GameContext';
import './Piece.css';

const Piece = ({ piece, player, onClick }) => {
    // Determine class based on status
    let statusClass = '';
    if (piece.status === 'stable') statusClass = 'in-stable';
    if (piece.status === 'finished') statusClass = 'finished';

    // Position handling will likely be done by the parent Board component 
    // placing this Piece in the correct cell. 
    // However, for animation, strictly we might want relative positioning.
    // For this implementation, we assume Piece is a child of the Cell or strictly positioned.

    return (
        <div
            className={`piece piece-${player.color} ${statusClass} ${piece.isClickable ? 'clickable' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(piece);
            }}
            title={`${player.name} - Piece ${piece.id}`}
        >
            <div className="piece-head"></div>
            <div className="piece-body"></div>
        </div>
    );
};

export default Piece;
