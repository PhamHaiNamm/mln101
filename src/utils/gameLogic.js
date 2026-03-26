
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
        { question: 'Trong kinh tế chính trị Mác - Lênin, hàng hóa có mấy thuộc tính cơ bản?', options: ['1', '2', '3', '4'], correctIndex: 1 },
        { question: 'Hai thuộc tính cơ bản của hàng hóa là gì?', options: ['Giá trị sử dụng và giá trị', 'Giá cả và lợi nhuận', 'Tiền tệ và thị trường', 'Cung và cầu'], correctIndex: 0 },
        { question: 'Lao động nào tạo ra giá trị của hàng hóa?', options: ['Lao động cụ thể', 'Lao động trừu tượng', 'Lao động quản lý', 'Lao động thủ công'], correctIndex: 1 },
        { question: 'Thước đo lượng giá trị của hàng hóa là gì?', options: ['Chi phí quảng cáo', 'Thời gian lao động xã hội cần thiết', 'Mức độ khan hiếm tự nhiên', 'Sở thích người mua'], correctIndex: 1 },
        { question: 'Tiền tệ ra đời từ đâu theo quan điểm Mác?', options: ['Do nhà nước sáng tạo tùy ý', 'Từ sự phát triển lâu dài của trao đổi hàng hóa', 'Do ngân hàng phát minh', 'Từ hoạt động từ thiện'], correctIndex: 1 },
        { question: 'Sức lao động trở thành hàng hóa khi nào?', options: ['Khi người lao động có tư liệu sản xuất', 'Khi người lao động tự do và không có tư liệu sản xuất cần thiết', 'Khi tiền lương tăng cao', 'Khi doanh nghiệp nhà nước phát triển'], correctIndex: 1 },
        { question: 'Giá trị sức lao động được quyết định bởi yếu tố nào?', options: ['Chi phí sản xuất ra tư liệu sản xuất', 'Giá cả của máy móc', 'Giá trị tư liệu sinh hoạt cần thiết để tái sản xuất sức lao động', 'Mức lãi suất ngân hàng'], correctIndex: 2 },
        { question: 'Giá trị thặng dư là phần giá trị dôi ra ngoài...', options: ['Chi phí nguyên vật liệu', 'Giá trị sức lao động của công nhân', 'Thuế doanh nghiệp', 'Khấu hao máy móc'], correctIndex: 1 },
        { question: 'Tư bản bất biến là bộ phận tư bản đầu tư vào...', options: ['Sức lao động', 'Máy móc, nhà xưởng, nguyên liệu', 'Tiền lương quản lý', 'Chi phí bán hàng'], correctIndex: 1 },
        { question: 'Tư bản khả biến là bộ phận tư bản dùng để mua...', options: ['Cổ phiếu', 'Nguyên vật liệu', 'Sức lao động', 'Đất đai'], correctIndex: 2 }
    ],
    ethics: [
        { question: 'Trong nền sản xuất hàng hóa, mục tiêu của người sản xuất là gì?', options: ['Tạo ra sản phẩm để tự tiêu dùng hoàn toàn', 'Sản xuất để trao đổi, bán trên thị trường', 'Sản xuất để cất trữ vô thời hạn', 'Ngừng lưu thông hàng hóa'], correctIndex: 1 },
        { question: 'Khi năng suất lao động xã hội tăng, lượng giá trị của một đơn vị hàng hóa thường...', options: ['Tăng lên', 'Giảm xuống', 'Không đổi tuyệt đối', 'Tăng gấp đôi'], correctIndex: 1 },
        { question: 'Nếu thời gian lao động cá biệt thấp hơn thời gian lao động xã hội cần thiết, người sản xuất có xu hướng...', options: ['Bị lỗ ngay', 'Thu lợi thế trong cạnh tranh', 'Không thể bán hàng', 'Phải ngừng sản xuất'], correctIndex: 1 },
        { question: 'Trong lưu thông hàng hóa giản đơn, công thức vận động là...', options: ['T - H - T', 'H - T - H', 'T - T - H', 'H - H - T'], correctIndex: 1 },
        { question: 'Công thức chung của tư bản là...', options: ['H - T - H', 'T - H - T\'', 'T - H - H', 'H - H - T'], correctIndex: 1 },
        { question: 'Nguồn gốc trực tiếp của giá trị thặng dư nằm ở đâu?', options: ['Trong lưu thông thuần túy', 'Trong sản xuất, do lao động làm thuê tạo ra', 'Trong hoạt động quảng bá sản phẩm', 'Trong tiêu dùng cá nhân'], correctIndex: 1 },
        { question: 'Tích lũy tư bản là quá trình...', options: ['Dùng toàn bộ giá trị thặng dư để tiêu dùng', 'Biến một phần giá trị thặng dư thành tư bản phụ thêm', 'Giảm quy mô sản xuất', 'Xóa bỏ cạnh tranh'], correctIndex: 1 },
        { question: 'Quy luật giá trị yêu cầu sản xuất và trao đổi hàng hóa dựa trên...', options: ['Ý muốn chủ quan của người bán', 'Thời gian lao động xã hội cần thiết', 'Mức lợi nhuận mong muốn', 'Sự áp đặt hành chính'], correctIndex: 1 }
    ],
    paradox: [
        { question: 'Mâu thuẫn cơ bản của sản xuất hàng hóa là mâu thuẫn giữa...', options: ['Lao động cụ thể và lao động trừu tượng', 'Giá trị sử dụng và giá trị', 'Tính chất tư nhân và tính chất xã hội của lao động', 'Cung và cầu'], correctIndex: 2 },
        { question: 'Trong chủ nghĩa tư bản, mâu thuẫn cơ bản nhất là giữa...', options: ['Công nhân và nông dân', 'Tính chất xã hội hóa của sản xuất và hình thức chiếm hữu tư nhân tư bản chủ nghĩa', 'Thành thị và nông thôn', 'Sản xuất và tiêu dùng cá nhân'], correctIndex: 1 },
        { question: 'Giá cả hàng hóa trên thị trường luôn xoay quanh yếu tố nào?', options: ['Sở thích ngẫu nhiên', 'Giá trị hàng hóa', 'Thu nhập cá nhân người bán', 'Khả năng quảng cáo'], correctIndex: 1 },
        { question: 'Khi cung lớn hơn cầu trong điều kiện khác không đổi, giá cả thị trường có xu hướng...', options: ['Tăng', 'Giảm', 'Không đổi', 'Mất hoàn toàn'], correctIndex: 1 },
        { question: 'Sản xuất thặng dư tương đối chủ yếu đạt được bằng cách nào?', options: ['Kéo dài ngày lao động', 'Tăng cường độ bóc lột bằng roi vọt', 'Nâng cao năng suất lao động xã hội', 'Giảm quy mô sản xuất'], correctIndex: 2 },
        { question: 'Khủng hoảng kinh tế trong chủ nghĩa tư bản phản ánh mâu thuẫn giữa...', options: ['Sản xuất và lưu thông tiền mặt', 'Tính tổ chức trong từng doanh nghiệp và tính vô chính phủ của toàn xã hội', 'Nhu cầu cá nhân và thời tiết', 'Nông nghiệp và công nghiệp nhẹ'], correctIndex: 1 }
    ],
    thinking: [
        { question: 'Một vật có ích nhưng không dùng để trao đổi thì theo Mác, nó là...', options: ['Hàng hóa hoàn chỉnh', 'Giá trị thặng dư', 'Giá trị sử dụng nhưng chưa phải hàng hóa', 'Tư bản cho vay'], correctIndex: 2 },
        { question: 'Nếu một công nhân tạo ra giá trị mới 12 giờ nhưng chỉ cần 6 giờ để tái tạo giá trị sức lao động, thì 6 giờ còn lại tạo ra...', options: ['Khấu hao', 'Giá trị thặng dư', 'Địa tô', 'Chi phí lưu thông'], correctIndex: 1 },
        { question: 'Trong sản xuất tư bản chủ nghĩa, bộ phận tư bản nào tạo ra giá trị mới?', options: ['Tư bản bất biến', 'Tư bản thương nghiệp', 'Tư bản khả biến', 'Tư bản cố định'], correctIndex: 2 },
        { question: 'Khi giá trị tư liệu sinh hoạt cần thiết của công nhân giảm xuống, giá trị sức lao động thường...', options: ['Tăng', 'Giảm', 'Không thể xác định', 'Tăng vô hạn'], correctIndex: 1 },
        { question: 'Một doanh nghiệp đổi mới công nghệ làm năng suất tăng trước mức trung bình xã hội. Trong ngắn hạn, doanh nghiệp đó có thể thu được...', options: ['Giá trị thặng dư siêu ngạch', 'Địa tô chênh lệch', 'Thuế gián thu', 'Lợi tức ngân hàng'], correctIndex: 0 },
        { question: 'Trong tuần hoàn tư bản sản xuất, giai đoạn mở đầu thường được biểu hiện bằng...', options: ['T - H', 'H\' - T\'', 'SX - H', 'T - T\''], correctIndex: 0 },
        { question: 'Lợi nhuận theo kinh tế chính trị Mác - Lênin là hình thức biến tướng của...', options: ['Giá trị sử dụng', 'Giá trị thặng dư', 'Chi phí sản xuất', 'Tiền công'], correctIndex: 1 },
        { question: 'Nếu nhà tư bản kéo dài ngày lao động trong khi thời gian lao động cần thiết không đổi, họ đang tạo ra chủ yếu...', options: ['Giá trị thặng dư tuyệt đối', 'Giá trị thặng dư tương đối', 'Địa tô tuyệt đối', 'Lợi nhuận thương nghiệp'], correctIndex: 0 }
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
