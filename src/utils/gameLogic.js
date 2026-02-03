
import { GRID_MAP } from './gridMap';

// Constants
// NOTE: MAIN_PATH length is defined in GRID_MAP (40 cells on the main loop).
export const BOARD_SETTINGS = {
    TOTAL_STEPS: 52, // Match GRID_MAP.MAIN_PATH.length for correct wrap-around
    HOME_ENTRANCE_STEPS: 6, // Steps into the center column
    SAFE_ZONES: [0, 10, 20, 30], // Approximate safe zones at each color's start
    // Start positions relative to the absolute index 0-(TOTAL_STEPS-1)
    START_POSITIONS: {
        red: 51,
        green: 12,
        blue: 25,
        yellow: 38
    }
};

// Các ô đặc biệt trên đường đi chính (theo index của MAIN_PATH)
// Chọn ~1/2 số ô làm ô chức năng, phân bố đều 5 loại.
const MAIN_LEN = GRID_MAP.MAIN_PATH.length;
const allIndices = Array.from({ length: MAIN_LEN }, (_, i) => i);
// Lấy các ô có index chẵn làm ô đặc biệt (khoảng một nửa)
const specialIndices = allIndices.filter(i => i % 2 === 0);

const SPECIAL_TYPES = ['knowledge', 'ethics', 'paradox', 'thinking', 'philosopher'];

export const SPECIAL_TILES = {
    knowledge: [],
    ethics: [],
    paradox: [],
    thinking: [],
    philosopher: []
};

specialIndices.forEach((idx, order) => {
    const type = SPECIAL_TYPES[order % SPECIAL_TYPES.length];
    SPECIAL_TILES[type].push(idx);
});

export const getTileType = (index) => {
    if (index == null || index < 0) return null;
    for (const [type, indices] of Object.entries(SPECIAL_TILES)) {
        if (indices.includes(index)) return type;
    }
    return null;
};

// Thông tin hiển thị cho từng loại ô
export const TILE_TYPE_INFO = {
    knowledge: {
        label: '🧠 Ô Tri Thức',
        symbol: '🧠',
        description: 'Trả lời đúng được tung thêm 1 lần xúc xắc. Sai thì hết lượt.'
    },
    ethics: {
        label: '⚖ Ô Đạo Đức',
        symbol: '⚖',
        description: 'Trả lời đúng tặng 1 sức mạnh cho người khác. Sai thì quân quay về vị trí trước đó.'
    },
    paradox: {
        label: '💥 Ô Nghịch Lý',
        symbol: '💥',
        description: 'Trả lời sai quân sẽ bị về chuồng.'
    },
    thinking: {
        label: '🌀 Ô Tư Duy',
        symbol: '🌀',
        description: 'Trả lời đúng được đá 1 quân đối thủ bất kỳ về chuồng.'
    },
    philosopher: {
        label: '👤 Ô Triết Gia',
        symbol: '👤',
        description: 'Không cần trả lời, tự động được cộng thêm 1 sức mạnh.'
    }
};

// Một vài câu hỏi mẫu cho từng loại ô (text tiếng Việt, code tiếng Anh)
const QUESTIONS_BANK = {
    knowledge: [
        { question: 'Trái Đất quay quanh Mặt Trời trong bao lâu?', options: ['1 tháng', '1 năm', '10 năm', '1 ngày'], correctIndex: 1 },
        { question: 'Nước sôi ở bao nhiêu độ C?', options: ['90°C', '100°C', '110°C', '80°C'], correctIndex: 1 },
        { question: 'Thủ đô của Việt Nam là?', options: ['TP.HCM', 'Đà Nẵng', 'Hà Nội', 'Huế'], correctIndex: 2 },
        { question: 'Đỉnh núi cao nhất thế giới?', options: ['Fansipan', 'Everest', 'Phú Sĩ', 'K2'], correctIndex: 1 },
        { question: 'Mặt trời mọc ở hướng nào?', options: ['Đông', 'Tây', 'Nam', 'Bắc'], correctIndex: 0 },
        { question: 'Loài vật nào được xem là chúa sơn lâm?', options: ['Sư tử', 'Hổ', 'Báo', 'Voi'], correctIndex: 1 },
        { question: 'Một năm có bao nhiêu tháng có 28 ngày?', options: ['1', '12 (tháng nào cũng có)', '6', '2'], correctIndex: 1 },
        { question: 'Ai là người đầu tiên đặt chân lên Mặt Trăng?', options: ['Gagarin', 'Neil Armstrong', 'Phạm Tuân', 'Buzz Aldrin'], correctIndex: 1 },
        { question: 'Con vật nào chạy nhanh nhất trên cạn?', options: ['Báo Cheetah', 'Sư tử', 'Ngựa', 'Đà điểu'], correctIndex: 0 },
        { question: 'Hành tinh nào gần Mặt Trời nhất?', options: ['Sao Kim', 'Sao Thủy', 'Sao Hỏa', 'Trái Đất'], correctIndex: 1 }
    ],
    ethics: [
        { question: 'Nhặt được của rơi?', options: ['Giữ luôn', 'Vứt đi', 'Tìm người trả lại', 'Chia bạn bè'], correctIndex: 2 },
        { question: 'Thấy người già qua đường?', options: ['Lờ đi', 'Giúp đỡ', 'Cười nhạo', 'Quay video'], correctIndex: 1 },
        { question: 'Bạn mượn đồ nhưng làm hỏng?', options: ['Giấu đi', 'Nói dối', 'Xin lỗi và đền bù', 'Đổ thừa'], correctIndex: 2 },
        { question: 'Thấy bạn bị bắt nạt?', options: ['Tham gia', 'Cổ vũ', 'Báo thầy cô/người lớn', 'Quay đi'], correctIndex: 2 },
        { question: 'Đi siêu thị thấy thừa tiền thối?', options: ['Cầm luôn', 'Trả lại thu ngân', 'Mua kẹo', 'Cho người nghèo'], correctIndex: 1 },
        { question: 'Xếp hàng nơi công cộng?', options: ['Chen ngang', 'Xếp ngay ngắn', 'Đẩy người trước', 'Nhờ giữ chỗ'], correctIndex: 1 },
        { question: 'Làm bài kiểm tra?', options: ['Quay cóp', 'Tự làm', 'Nhìn bài bạn', 'Hỏi bài'], correctIndex: 1 },
        { question: 'Thấy rác nơi công cộng?', options: ['Vứt thêm', 'Kệ nó', 'Nhặt bỏ thùng rác', 'Đá đi'], correctIndex: 2 }
    ],
    paradox: [
        { question: 'Nghịch lý "Người nói dối": "Tôi đang nói dối". Câu này?', options: ['Đúng', 'Sai', 'Vừa đúng vừa sai', 'Là nghịch lý'], correctIndex: 3 },
        { question: 'Con gà có trước hay quả trứng có trước?', options: ['Con gà', 'Quả trứng', 'Không biết', 'Khoa học chưa chứng minh'], correctIndex: 3 },
        { question: 'Nghịch lý Achilles và rùa: Achilles có đuổi kịp rùa không?', options: ['Có (thực tế)', 'Không (lý thuyết)', 'Chạy ngang nhau', 'Rùa thắng'], correctIndex: 0 },
        { question: 'Nếu Pinocchio nói "Mũi tôi sẽ dài ra", chuyện gì xảy ra?', options: ['Mũi dài ra', 'Không dài', 'Nghịch lý', 'Mũi ngắn lại'], correctIndex: 2 },
        { question: 'Chiếc tàu Theseus: Thay hết bộ phận thì còn là tàu cũ không?', options: ['Có', 'Không', 'Tùy quan điểm', 'Thành tàu mới'], correctIndex: 2 },
        { question: 'Nghịch lý ông nội: Quay về quá khứ hại ông nội?', options: ['Được', 'Không thể', 'Tạo vũ trụ song song', 'Biến mất'], correctIndex: 2 }
    ],
    thinking: [
        { question: 'Con gì buổi sáng đi 4 chân, trưa 2 chân, tối 3 chân?', options: ['Con chó', 'Con người', 'Con khỉ', 'Con mèo'], correctIndex: 1 },
        { question: 'Cái gì càng rửa càng bẩn?', options: ['Nước', 'Quần áo', 'Bát đĩa', 'Xe'], correctIndex: 0 },
        { question: 'Tháng nào ngắn nhất trong năm?', options: ['Tháng 2', 'Tháng 5', 'Tháng 12', 'Tháng 3'], correctIndex: 0 },
        { question: 'Cái gì thuộc về bạn nhưng người khác dùng nhiều hơn?', options: ['Tiền', 'Tên của bạn', 'Xe', 'Điện thoại'], correctIndex: 1 },
        { question: 'Bỏ ngoài nướng trong, ăn ngoài bỏ trong là gì?', options: ['Khoai lang', 'Bắp ngô', 'Trứng gà', 'Mía'], correctIndex: 1 },
        { question: 'Cái gì có cổ nhưng không có miệng?', options: ['Cái chai', 'Cái áo', 'Con hươu', 'Cái bình'], correctIndex: 1 },
        { question: 'Cái gì chặt không đứt, bứt không rời?', options: ['Dây thừng', 'Nước', 'Tơ nhện', 'Tình yêu'], correctIndex: 1 },
        { question: 'Có 3 quả táo, lấy đi 2 quả. Bạn còn mấy quả?', options: ['1', '2', '0', '3'], correctIndex: 1 }
    ]
};

export const getRandomQuestion = (type) => {
    const list = QUESTIONS_BANK[type] || [];
    if (!list.length) return null;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
};

/**
 * Check if a move is valid based on game rules
 */
export const checkMove = (piece, diceValue, currentPlayer, allPlayers) => {
    // 1. Stable Check: Must roll 1 or 6 to exit
    if (piece.status === 'stable') {
        if (diceValue === 1 || diceValue === 6) {
            // Không cho ra chuồng nếu ô xuất quân đã có quân mình đứng
            const startIdx = GRID_MAP.START_INDEX[currentPlayer.color];
            const ownHasOnStart = currentPlayer.pieces.some(
                p => p.status === 'active' && p.position === startIdx
            );
            if (ownHasOnStart) {
                return { valid: false, reason: 'Start tile already occupied by your piece' };
            }
            return { valid: true, action: 'EXIT_STABLE' };
        }
        return { valid: false, reason: 'Must roll 1 or 6 to start' };
    }

    // 2. Finished Check
    if (piece.status === 'finished') {
        return { valid: false, reason: 'Piece already finished' };
    }

    // Calculate current global position and potential new position
    const currentPos = piece.position;

    // 2.5 Home overshoot check (áp dụng cho cả active/home)
    // Tổng bước để về đích = số ô đường chính + 6 ô home, và về đích khi newStepsMoved === total
    const totalStepsToFinish = GRID_MAP.MAIN_PATH.length + BOARD_SETTINGS.HOME_ENTRANCE_STEPS;
    if ((piece.status === 'active' || piece.status === 'home') && typeof piece.stepsMoved === 'number') {
        const newStepsMoved = piece.stepsMoved + diceValue;
        if (newStepsMoved > totalStepsToFinish) {
            return { valid: false, reason: 'Move blocked! Overshot home.' };
        }
    }

    // 4. Path Blocking Check (Cannot jump over enemies) & Landing Logic
    if (piece.status === 'active') {
        const startIdx = GRID_MAP.START_INDEX[currentPlayer.color];
        const mainLen = GRID_MAP.MAIN_PATH.length;

        // Loop intermediate steps [1 ... diceValue - 1]
        for (let step = 1; step < diceValue; step++) {
            const checkSteps = piece.stepsMoved + step;
            // Chỉ check block trên đường chính
            if (checkSteps < mainLen) {
                const checkIdx = (startIdx + checkSteps) % mainLen;

                // Check if ANY enemy is here (Block Logic)
                const enemyHere = allPlayers.some(p =>
                    p.id !== currentPlayer.id &&
                    p.pieces.some(ep => ep.status === 'active' && ep.position === checkIdx)
                );

                if (enemyHere) {
                    return { valid: false, reason: `Blocked by enemy at step ${step}` };
                }

                // Check own piece (Block Logic)
                const ownHere = currentPlayer.pieces.some(p =>
                    p.id !== piece.id && p.status === 'active' && p.position === checkIdx
                );
                if (ownHere) {
                    return { valid: false, reason: `Blocked by own piece at step ${step}` };
                }
            }
        }

        // Check Destination (Land on diceValue)
        const destSteps = piece.stepsMoved + diceValue;
        if (destSteps < mainLen) { // Still on main track
            const destIdx = (startIdx + destSteps) % mainLen;

            // Check own piece at destination
            const ownAtDest = currentPlayer.pieces.some(p =>
                p.id !== piece.id && p.status === 'active' && p.position === destIdx
            );
            if (ownAtDest) {
                return { valid: false, reason: 'Cannot land on own piece' };
            }

            // Check enemy at destination -> KICK
            const enemyAtDest = allPlayers.some(p =>
                p.id !== currentPlayer.id &&
                p.pieces.some(ep => ep.status === 'active' && ep.position === destIdx)
            );

            if (enemyAtDest) {
                return { valid: true, action: 'KICK_ENEMY', target: destIdx };
            }
        }
    }

    // Default Move
    return { valid: true, action: 'MOVE' };
};

/**
 * Get new position after move
 */
export const calculateNewPosition = (currentPos, steps, playerColor) => {
    // This is a placeholder. Real logic needs to account for entering Home Column
    // based on playerColor's Home Entrance index.

    // Simple wrap around for prototype
    let newPos = currentPos + steps;
    if (newPos >= BOARD_SETTINGS.TOTAL_STEPS) {
        newPos = newPos % BOARD_SETTINGS.TOTAL_STEPS;
    }
    return newPos;
};
