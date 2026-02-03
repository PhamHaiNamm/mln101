import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { checkMove, BOARD_SETTINGS, getTileType, getRandomQuestion } from '../utils/gameLogic';
import { GRID_MAP } from '../utils/gridMap';

const GameContext = createContext();

const initialState = {
    gameState: 'SETUP', // SETUP, PLAYING, FINISHED
    players: [], // { id, name, color, pieces: [] }
    currentPage: 'HOME', // HOME, GAME
    currentPlayerIndex: 0,
    diceValue: null,
    turnStatus: 'ROLL', // ROLL, MOVE, ANIMATING
    winner: null,
    logs: [], // Game history logs
    animation: null, // { playerId, pieceId, path: number[], currentIndex: number }
    question: null // { type, playerId, pieceId, tileIndex, prevPosition, prevStepsMoved, questionText, options, correctIndex }
};

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'START_GAME':
            return {
                ...state,
                gameState: 'PLAYING',
                currentPage: 'GAME',
                players: action.payload.players,
                currentPlayerIndex: 0,
                diceValue: null,
                turnStatus: 'ROLL',
                logs: ['Game started!']
            };
        case 'ROLL_DICE':
            return {
                ...state,
                diceValue: action.payload,
                turnStatus: 'MOVE', // Wait for player to choose move or auto-skip
            };
        case 'SET_TURN_STATUS':
            return {
                ...state,
                turnStatus: action.payload
            };
        case 'SET_ANIMATION':
            return {
                ...state,
                animation: action.payload
            };
        case 'ADVANCE_ANIMATION_STEP':
            if (!state.animation) return state;
            return {
                ...state,
                animation: {
                    ...state.animation,
                    currentIndex: Math.min(
                        state.animation.currentIndex + 1,
                        state.animation.path.length - 1
                    )
                }
            };
        case 'NEXT_TURN':
            let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return {
                ...state,
                currentPlayerIndex: nextIndex,
                diceValue: null,
                turnStatus: 'ROLL'
            };
        case 'MOVE_PIECE':
            // Payload: { playerId, pieceId }
            const { playerId, pieceId } = action.payload;
            const player = state.players.find(p => p.id === playerId);
            const piece = player.pieces.find(p => p.id === pieceId);

            // Safety check
            if (!player || !piece) return state;

            // Validate Move
            const validation = checkMove(piece, state.diceValue, player, state.players);

            if (!validation.valid) {
                // Could add a toast or log here
                return { ...state, logs: [`Invalid Move: ${validation.reason}`, ...state.logs].slice(0, 5) };
            }

            // Execute Move
            let newPieceState = { ...piece };
            let newLog = '';
            let triggeredTileType = null;

            if (validation.action === 'EXIT_STABLE') {
                // Move to Start Position
                const startIdx = GRID_MAP.START_INDEX[player.color];
                newPieceState.status = 'active';
                newPieceState.position = startIdx; // This is Main Track Index 0-51 (approx)
                newPieceState.stepsMoved = 0; // Steps moved on track
                newLog = `${player.name} moved Piece ${pieceId + 1} out!`;
            } else if (validation.action === 'MOVE' || validation.action === 'KICK_ENEMY') {
                // Calculate new steps total
                const mainPathLen = GRID_MAP.MAIN_PATH.length; // 52
                let stepsToAdd = state.diceValue;
                let newStepsMoved = piece.stepsMoved + stepsToAdd;

                // HOME COLUMN LOGIC (theo tổng bước)
                // Tổng bước để vào home = độ dài đường chính. Sau đó có 6 ô home, và về đích khi == mainLen + 6.
                const totalStepsToFinish = mainPathLen + BOARD_SETTINGS.HOME_ENTRANCE_STEPS; // main + 6
                if (newStepsMoved >= mainPathLen) {
                    // Entering or Inside Home Column
                    // Home Column Indices 0-5.
                    const homeIndex = newStepsMoved - mainPathLen;

                    if (homeIndex > 5) {
                        // Về đích khi newStepsMoved === totalStepsToFinish (homeIndex === 6)
                        if (newStepsMoved === totalStepsToFinish) {
                            // FINISHED!
                            newPieceState.status = 'finished';
                            newPieceState.position = -1; // Removed from board visuals? or Center?
                            newLog = `${player.name}'s Piece Finished!`;
                        } else {
                            // Không di chuyển được quân này: vẫn cho chọn quân khác với cùng xúc xắc
                            newLog = `Move blocked! Overshot home.`;

                            const hasOtherValidMove = player.pieces.some(pp => {
                                if (pp.id === pieceId) return false;
                                const v = checkMove(pp, state.diceValue, player, state.players);
                                return v.valid;
                            });

                            if (hasOtherValidMove) {
                                return {
                                    ...state,
                                    logs: [newLog, ...state.logs].slice(0, 5),
                                    // giữ diceValue và turnStatus MOVE để người chơi chọn quân khác
                                    turnStatus: 'MOVE'
                                };
                            }

                            // Nếu không có quân nào khác đi được, mới chuyển lượt
                            return {
                                ...state,
                                logs: [newLog, ...state.logs].slice(0, 5),
                                diceValue: null,
                                turnStatus: 'ROLL',
                                currentPlayerIndex: (state.diceValue === 6)
                                    ? state.currentPlayerIndex
                                    : (state.currentPlayerIndex + 1) % state.players.length
                            };
                        }
                    } else {
                        // Valid move in home column
                        newPieceState.position = homeIndex; // Reuse position for Home Index (0-5)
                        newPieceState.stepsMoved = newStepsMoved;
                        newPieceState.status = 'home'; // Distinct status for rendering
                        newLog = `${player.name} moved closer to home!`;
                    }

                } else {
                    // Still on Main Track
                    newPieceState.stepsMoved = newStepsMoved;

                    // Kick Logic
                    if (validation.action === 'KICK_ENEMY') {
                        // Logic handled below in player update
                        newLog += " KICK!";
                    }

                    newLog = `${player.name} moved ${stepsToAdd} steps.`;

                    // Calculate global index (0-51)
                    const startIdx = GRID_MAP.START_INDEX[player.color];
                    newPieceState.position = (startIdx + newStepsMoved) % mainPathLen;

                    // Kiểm tra xem có dừng ở ô đặc biệt không (chỉ áp dụng trên đường chính)
                    triggeredTileType = getTileType(newPieceState.position);
                }
            }

            // Update Players Array & Check Win Condition + Kick logic
            let gameWon = false;
            const landingPos =
                newPieceState.status === 'active' ? newPieceState.position : null;

            let updatedPlayersList = state.players.map(p => {
                if (p.id === playerId) {
                    const updatedPieces = p.pieces.map(pp => pp.id === pieceId ? newPieceState : pp);
                    // Check if all pieces finished
                    if (updatedPieces.every(up => up.status === 'finished')) {
                        gameWon = true;
                    }
                    return { ...p, pieces: updatedPieces };
                }

                // Xử lý đá quân: nếu quân hiện tại đáp xuống ô có quân địch đang ACTIVE trên đường chính
                if (landingPos != null) {
                    const newEnemyPieces = p.pieces.map(ep => {
                        if (ep.status === 'active' && ep.position === landingPos) {
                            newLog += ` Kicked ${p.name}'s piece!`;
                            return { ...ep, status: 'stable', position: -1, stepsMoved: 0 };
                        }
                        return ep;
                    });
                    return { ...p, pieces: newEnemyPieces };
                }

                return p;
            });

            if (gameWon) {
                return {
                    ...state,
                    players: updatedPlayersList,
                    gameState: 'FINISHED',
                    winner: player.name, // Store the winner's name
                    logs: [`${player.name} WINS THE GAME!`, ...state.logs].slice(0, 5)
                };
            }

            // Nếu dừng ở ô Triết Gia: cộng sức mạnh ngay, không cần hỏi
            if (triggeredTileType === 'philosopher') {
                updatedPlayersList = updatedPlayersList.map(p => {
                    if (p.id !== playerId) return p;
                    const currentPower = p.power ?? 0;
                    return { ...p, power: currentPower + 1 };
                });
                newLog += ` ${player.name} được cộng thêm 1 sức mạnh (Ô Triết Gia).`;
                triggeredTileType = null; // Đã xử lý, không hỏi đáp
            }

            // Nếu dừng ở ô cần trả lời câu hỏi
            if (triggeredTileType && ['knowledge', 'ethics', 'paradox', 'thinking'].includes(triggeredTileType)) {
                const qData = getRandomQuestion(triggeredTileType);

                return {
                    ...state,
                    players: updatedPlayersList,
                    logs: [newLog, ...state.logs].slice(0, 5),
                    diceValue: null, // đã dùng xong
                    turnStatus: 'QUESTION',
                    // Giữ nguyên currentPlayerIndex để xử lý thưởng/phạt sau khi trả lời
                    question: qData ? {
                        type: triggeredTileType,
                        playerId,
                        pieceId,
                        tileIndex: newPieceState.position,
                        prevPosition: piece.position,
                        prevStepsMoved: piece.stepsMoved,
                        questionText: qData.question,
                        options: qData.options,
                        correctIndex: qData.correctIndex
                    } : null
                };
            }

            // Không có ô đặc biệt: chuyển lượt bình thường
            return {
                ...state,
                players: updatedPlayersList,
                logs: [newLog, ...state.logs].slice(0, 5),
                diceValue: null, // Consume dice
                turnStatus: 'ROLL', // Next turn phase (usually next player unless 6? Standard rule: 6 rolls again)
                currentPlayerIndex: (state.diceValue === 6) ? state.currentPlayerIndex : (state.currentPlayerIndex + 1) % state.players.length
            };
        case 'ADD_LOG':
            return {
                ...state,
                logs: [action.payload, ...state.logs].slice(0, 5)
            };
        case 'RESOLVE_TILE_QUESTION': {
            if (!state.question) return state;
            const { isCorrect } = action.payload;
            const q = state.question;

            let newLogs = [...state.logs];
            let newPlayers = state.players.map(p => ({ ...p }));
            let nextPlayerIndex = state.currentPlayerIndex;
            let nextTurnStatus = 'ROLL';

            const logPrefix = q.type === 'knowledge' ? 'Ô Tri Thức'
                : q.type === 'ethics' ? 'Ô Đạo Đức'
                    : q.type === 'paradox' ? 'Ô Nghịch Lý'
                        : q.type === 'thinking' ? 'Ô Tư Duy'
                            : 'Ô Đặc Biệt';

            if (q.type === 'knowledge') {
                if (isCorrect) {
                    newLogs = [`${logPrefix}: trả lời ĐÚNG, được tung thêm 1 lần xúc xắc.`, ...newLogs];
                    // Giữ nguyên người chơi hiện tại, cho phép roll lại
                    nextTurnStatus = 'ROLL';
                } else {
                    newLogs = [`${logPrefix}: trả lời SAI, hết lượt.`, ...newLogs];
                    // Chuyển sang người tiếp theo
                    nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
                }
            } else if (q.type === 'ethics') {
                if (isCorrect) {
                    // Cho người khác 1 điểm sức mạnh (người kế tiếp)
                    const targetIndex = (q.playerId + 1) % state.players.length;
                    newPlayers = newPlayers.map(p => {
                        if (p.id !== targetIndex) return p;
                        const currentPower = p.power ?? 0;
                        return { ...p, power: currentPower + 1 };
                    });
                    newLogs = [`${logPrefix}: trả lời ĐÚNG, tặng 1 sức mạnh cho người chơi ${targetIndex + 1}.`, ...newLogs];
                    nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
                } else {
                    // Sai: quân quay về vị trí trước đó
                    newPlayers = newPlayers.map(p => {
                        if (p.id !== q.playerId) return p;
                        const newPieces = p.pieces.map(pc => {
                            if (pc.id !== q.pieceId) return pc;
                            return {
                                ...pc,
                                position: q.prevPosition,
                                stepsMoved: q.prevStepsMoved
                            };
                        });
                        return { ...p, pieces: newPieces };
                    });
                    newLogs = [`${logPrefix}: trả lời SAI, quân quay về vị trí trước đó.`, ...newLogs];
                    nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
                }
            } else if (q.type === 'paradox') {
                if (isCorrect) {
                    newLogs = [`${logPrefix}: trả lời ĐÚNG, an toàn.`, ...newLogs];
                } else {
                    // Sai: quân về chuồng
                    newPlayers = newPlayers.map(p => {
                        if (p.id !== q.playerId) return p;
                        const newPieces = p.pieces.map(pc => {
                            if (pc.id !== q.pieceId) return pc;
                            return {
                                ...pc,
                                status: 'stable',
                                position: -1,
                                stepsMoved: 0
                            };
                        });
                        return { ...p, pieces: newPieces };
                    });
                    newLogs = [`${logPrefix}: trả lời SAI, quân bị về chuồng.`, ...newLogs];
                }
                nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            } else if (q.type === 'thinking') {
                if (isCorrect) {
                    // Đá 1 quân đối thủ bất kỳ (nếu có)
                    let kickedSomeone = false;
                    newPlayers = newPlayers.map(p => {
                        if (p.id === q.playerId) return p;
                        const newPieces = p.pieces.map(pc => {
                            if (!kickedSomeone && pc.status === 'active') {
                                kickedSomeone = true;
                                return {
                                    ...pc,
                                    status: 'stable',
                                    position: -1,
                                    stepsMoved: 0
                                };
                            }
                            return pc;
                        });
                        return { ...p, pieces: newPieces };
                    });
                    if (kickedSomeone) {
                        newLogs = [`${logPrefix}: trả lời ĐÚNG, đá 1 quân đối thủ về chuồng.`, ...newLogs];
                    } else {
                        newLogs = [`${logPrefix}: trả lời ĐÚNG nhưng không có quân đối thủ nào để đá.`, ...newLogs];
                    }
                } else {
                    newLogs = [`${logPrefix}: trả lời SAI, hết lượt.`, ...newLogs];
                }
                nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            }

            return {
                ...state,
                players: newPlayers,
                logs: newLogs.slice(0, 5),
                question: null,
                diceValue: null,
                currentPlayerIndex: nextPlayerIndex,
                turnStatus: nextTurnStatus
            };
        }
        case 'RESET_GAME':
            return initialState;
        default:
            return state;
    }
};

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const startGame = (numPlayers) => {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
            id: i,
            name: `Player ${i + 1}`,
            color: colors[i],
            power: 0,
            pieces: [0, 1, 2, 3].map(pId => ({
                id: pId,
                status: 'stable', // stable, active, finished
                position: -1, // -1 means in stable
                stepsMoved: 0
            }))
        }));

        dispatch({ type: 'START_GAME', payload: { players: newPlayers } });
    };

    const rollDice = () => {
        // Generate 1-6
        const value = Math.floor(Math.random() * 6) + 1;
        // Kiểm tra xem người chơi hiện tại có quân nào đi hợp lệ với giá trị này không
        const currentPlayer = state.players[state.currentPlayerIndex];
        let hasValidMove = false;

        if (currentPlayer) {
            for (const piece of currentPlayer.pieces) {
                const validation = checkMove(piece, value, currentPlayer, state.players);
                if (validation.valid) {
                    hasValidMove = true;
                    break;
                }
            }
        }

        // Cập nhật giá trị xúc xắc và trạng thái lượt
        dispatch({ type: 'ROLL_DICE', payload: value });
        dispatch({ type: 'ADD_LOG', payload: `Player ${state.currentPlayerIndex + 1} rolled a ${value}` });

        // Nếu không có quân nào đi được (ví dụ: tất cả còn trong chuồng và không gieo được 1 hoặc 6),
        // tự động bỏ lượt và chuyển sang người tiếp theo để tránh kẹt vòng lặp.
        if (!hasValidMove) {
            dispatch({ type: 'ADD_LOG', payload: `No valid moves for Player ${state.currentPlayerIndex + 1}. Skipping turn.` });
            dispatch({ type: 'NEXT_TURN' });
        }
        return value;
    };

    const endTurn = () => {
        dispatch({ type: 'NEXT_TURN' });
    };

    const movePiece = (playerId, pieceId) => {
        const player = state.players.find(p => p.id === playerId);
        const piece = player?.pieces.find(p => p.id === pieceId);

        if (!player || !piece) return;
        if (state.diceValue == null) return;

        // Không cho click trong lúc đang animate
        if (state.turnStatus === 'ANIMATING') return;

        // Validate move trước
        const validation = checkMove(piece, state.diceValue, player, state.players);
        if (!validation.valid) {
            dispatch({ type: 'ADD_LOG', payload: `Invalid Move: ${validation.reason}` });
            return;
        }

        // Nếu quân đang ở trên đường chính và chỉ là di chuyển bình thường/kick
        // thì tạo animation đi từng ô một, sau đó mới áp dụng MOVE_PIECE thật để xử lý luật (kick, về nhà, thắng, ...).
        if (
            piece.status === 'active' &&
            (validation.action === 'MOVE' || validation.action === 'KICK_ENEMY')
        ) {
            const mainPathLen = GRID_MAP.MAIN_PATH.length;
            const startIdx = GRID_MAP.START_INDEX[player.color];
            const path = [];

            for (let step = 1; step <= state.diceValue; step++) {
                const newSteps = piece.stepsMoved + step;
                const idx = (startIdx + newSteps) % mainPathLen;
                path.push(idx);
            }

            // Lưu state animation để Board dùng vẽ quân theo từng ô
            dispatch({
                type: 'SET_ANIMATION',
                payload: {
                    playerId,
                    pieceId,
                    path,
                    currentIndex: 0
                }
            });
            dispatch({ type: 'SET_TURN_STATUS', payload: 'ANIMATING' });

            const stepDuration = 200; // ms cho mỗi ô

            path.forEach((_, index) => {
                setTimeout(() => {
                    // Tiến 1 bước trong animation (chỉ dùng cho hiển thị)
                    dispatch({ type: 'ADVANCE_ANIMATION_STEP' });

                    // Bước cuối cùng: clear animation và thực hiện MOVE_PIECE logic thật
                    if (index === path.length - 1) {
                        dispatch({ type: 'SET_ANIMATION', payload: null });
                        dispatch({ type: 'MOVE_PIECE', payload: { playerId, pieceId } });
                    }
                }, (index + 1) * stepDuration);
            });
        } else {
            // Các trường hợp khác (ra chuồng, vào home, đã về đích, ...) giữ nguyên logic cũ
            dispatch({ type: 'MOVE_PIECE', payload: { playerId, pieceId } });
        }
    };

    return (
        <GameContext.Provider value={{ state, dispatch, startGame, rollDice, endTurn, movePiece }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
