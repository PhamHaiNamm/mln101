import React from 'react';
import { useGame } from '../context/GameContext';
import { GRID_MAP } from '../utils/gridMap';
import { getTileType, TILE_TYPE_INFO } from '../utils/gameLogic';
import Piece from './Piece';
import Dice from './Dice';
import './Board.css';

const Board = () => {
    const { state, movePiece, dispatch } = useGame();

    // Helper to handle cell click/piece click
    const handlePieceClick = (piece, player) => {
        if (state.turnStatus !== 'MOVE') return;
        if (state.players[state.currentPlayerIndex].id !== player.id) return;

        movePiece(player.id, piece.id);
    };



    // We will simply render the Board Container and place absolute children or Grid Children

    // Get all active pieces to render
    const renderPieces = () => {
        return state.players.flatMap(player =>
            player.pieces.map(piece => {
                // Calculate Position Style
                let style = {};

                if (piece.status === 'stable') {
                    // Place in stable grid
                    // Base coordinate + offset for 4 pieces
                    const base = GRID_MAP.STABLES[player.color];
                    const offsets = [[0, 0], [0, 1], [1, 0], [1, 1]]; // 2x2 grid in stable
                    const pos = offsets[piece.id];
                    style = {
                        gridRow: base[0] + pos[0] + 1, // 1-based CSS Grid
                        gridColumn: base[1] + pos[1] + 1
                    };
                } else if (piece.status === 'active') {
                    // Map Track Index to Row/Col
                    let indexToUse = piece.position;

                    // Nếu đang animate quân này, dùng vị trí theo animation path
                    if (
                        state.animation &&
                        state.animation.playerId === player.id &&
                        state.animation.pieceId === piece.id
                    ) {
                        indexToUse =
                            state.animation.path[state.animation.currentIndex] ?? piece.position;
                    }

                    const coord = GRID_MAP.MAIN_PATH[indexToUse];
                    if (coord) {
                        style = {
                            gridRow: coord[0] + 1,
                            gridColumn: coord[1] + 1
                        };
                    }
                } else if (piece.status === 'home') {
                    // Home Column Position
                    // piece.position is Index 0-5 in HOME_PATHS
                    const homePath = GRID_MAP.HOME_PATHS[player.color];
                    if (homePath && homePath[piece.position]) {
                        const coord = homePath[piece.position];
                        style = {
                            gridRow: coord[0] + 1,
                            gridColumn: coord[1] + 1
                        };
                    }
                } else if (piece.status === 'finished') {
                    // Center Zone placement (random or specific slot)
                    // Just put them in center
                    style = {
                        gridRow: GRID_MAP.CENTER[0] + 1,
                        gridColumn: GRID_MAP.CENTER[1] + 1,
                        transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`
                    };
                }
                // Handle Home Column Logic here later if extending beyond main track

                const isCurrentTurn = state.players[state.currentPlayerIndex].id === player.id;
                const isClickable = isCurrentTurn && state.turnStatus === 'MOVE' && state.diceValue !== null;

                return (
                    <div key={`${player.id}-${piece.id}`} className="piece-wrapper" style={style}>
                        <Piece
                            piece={{ ...piece, isClickable }}
                            player={player}
                            onClick={() => handlePieceClick(piece, player)}
                        />
                    </div>
                );
            })
        );
    };

    const currentPlayer = state.players[state.currentPlayerIndex];

    const handleAnswer = (optionIndex) => {
        if (!state.question) return;
        const isCorrect = optionIndex === state.question.correctIndex;
        dispatch({ type: 'RESOLVE_TILE_QUESTION', payload: { isCorrect } });
    };

    return (
        <div className="game-screen">
            <div className="left-panel glass-panel">
                <h2 style={{ color: `var(--player-${currentPlayer.color})` }}>
                    {currentPlayer.name}'s Turn
                </h2>
                <Dice />
                <div className="power-board">
                    <h3>Sức mạnh người chơi</h3>
                    {state.players.map(p => (
                        <p key={p.id} style={{ color: `var(--player-${p.color})` }}>
                            {p.name}: {p.power ?? 0}
                        </p>
                    ))}
                </div>
                <div className="game-logs">
                    <h3>Log</h3>
                    {state.logs.map((l, i) => <p key={i}>{l}</p>)}
                </div>
                <button className="secondary-btn" onClick={() => window.location.reload()}>Quit Game</button>
            </div>

            <div className="board-container glass-panel">
                <div className="ludo-grid">
                    {/* Background Stables */}
                    <div className="stable stable-red"></div>
                    <div className="stable stable-green"></div>
                    <div className="stable stable-blue"></div>
                    <div className="stable stable-yellow"></div>

                    {/* Center */}
                    <div className="center-zone"></div>

                    {/* Grid Cells for Track Visuals (Generated or Hardcoded DIVs for styling) */}
                    {GRID_MAP.MAIN_PATH.map((pos, i) => {
                        const tileType = getTileType(i);
                        const specialClass = tileType ? `tile-${tileType}` : '';
                        const symbol = tileType && TILE_TYPE_INFO[tileType]?.symbol;
                        return (
                            <div
                                key={i}
                                className={`track-cell ${i === 0 ? 'start-red' : ''} ${specialClass}`}
                                style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }}
                            >
                                {symbol && <span className="tile-symbol">{symbol}</span>}
                            </div>
                        );
                    })}

                    {/* Home Path Cells */}
                    {Object.entries(GRID_MAP.HOME_PATHS).map(([color, path]) => (
                        path.map((pos, i) => (
                            <div
                                key={`home-${color}-${i}`}
                                className={`home-cell home-${color}`}
                                style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }}
                            >
                            </div>
                        ))
                    ))}

                    {/* Pieces Layer */}
                    {renderPieces()}
                </div>
            </div>

            {state.question && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                        {TILE_TYPE_INFO[state.question.type] && (
                            <>
                                <h2 className="text-gradient">{TILE_TYPE_INFO[state.question.type].label}</h2>
                                <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                                    {TILE_TYPE_INFO[state.question.type].description}
                                </p>
                            </>
                        )}
                        <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            {state.question.questionText}
                        </p>
                        <div className="rules-list">
                            {state.question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className="secondary-btn"
                                    style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
                                    onClick={() => handleAnswer(idx)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Board;
