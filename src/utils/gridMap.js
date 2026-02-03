
// Map linear track 0-51 (Standard 52? or 56?) to Grid Coordinates 0-14, 0-14
// Using a 15x15 grid.
// Top Left is 0,0. Bottom Right is 14,14.

// Standard Ludo Path:
// Starts at Red (Bottom Left usually? Or Top Left?)
// Let's assume Top Left Red base.
// Start at (6, 1) -> (6, 5) etc. 

// A hardcoded mapping is safest for visual accuracy.
export const GRID_MAP = {
    // Main Track (0-55 usually, depends on exact version, let's use 52 for standard + home runs)
    // We will use a defined path.
    // Red Start @ 1 (coord 6,1)

    // We can define the path as a list of [row, col]
    // 0: Red Start (Exit from stable)
    MAIN_PATH: [
        // Red Path to Blue
        [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
        [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
        [0, 7], // Corner top center
        [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],

        // Blue Path to Yellow
        [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
        [7, 14], // Corner right center
        [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],

        // Yellow Path to Green
        [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
        [14, 7], // Corner bottom center
        [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],

        // Green Path to Red
        [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
        [7, 0], // Corner left center
        [6, 0] // End of loop before overlapping Red Start
    ],

    // Start Indexes on Main Path for each color
    START_INDEX: {
        // Vị trí xuất quân cho từng màu.
        // Theo góp ý: đỏ lùi 1 ô, xanh lá / xanh dương / vàng tiến 1 ô
        // so với cấu hình trước đó, để cân đối hơn quanh chuồng.
        red: 51,
        green: 12,
        blue: 25,
        yellow: 38
    },

    // Coordinates for Stables (4 corners)
    // Phải khớp với màu nền trong Board.css:
    // - stable-red   : góc trên trái
    // - stable-green : góc trên phải
    // - stable-blue  : góc dưới phải
    // - stable-yellow: góc dưới trái
    STABLES: {
        red: [2, 2],     // trùng stable-red
        green: [2, 12],  // trùng stable-green
        blue: [12, 12],  // trùng stable-blue
        yellow: [12, 2]  // trùng stable-yellow
    },

    // Coordinates for Home Columns (Final stretch)
    // Đặt lại để mỗi màu có đường home gần chuồng của mình:
    // - red   (góc trên trái)      -> nhánh trái vào center
    // - green (góc trên phải)      -> nhánh trên vào center
    // - blue  (góc dưới phải)      -> nhánh phải vào center
    // - yellow(góc dưới trái)      -> nhánh dưới vào center
    HOME_PATHS: {
        red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],          // nhánh trái
        green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],        // nhánh trên
        blue: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],     // nhánh phải
        yellow: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]    // nhánh dưới
    },

    // Center Winning Zone
    CENTER: [7, 7]
};
