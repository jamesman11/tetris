var App = App || {};
App.CONFIG = {
    WIDTH_PER_GRID : 35,
    PREVIEW_TILE_WIDTH: 25,
    DEFAULT_STARTING_POINT: { row: 0, col: 3},
    BOARD_LINE_COLOR: '#f0d7b4',
    SPEED: { start: 0.6, decrement: 0.005, min: 0.1 },
    /*
       all tiles are transformed to a hexadecimal number, each digit indicates whether a tile exists at a specific position
       blocks: each element represents a rotation of the piece (0, 90, 180, 270)
              each element is a 16 bit integer where the 16 bits represent
              a 4x4 set of blocks, e.g. j.blocks[0] = 0x44C0

                  0100 = 0x4 << 3 = 0x4000
                  0100 = 0x4 << 2 = 0x0400
                  1100 = 0xC << 1 = 0x00C0
                  0000 = 0x0 << 0 = 0x0000
                                    ------
                                    0x44C0

       PREW_MAX_HORI and PREW_MAX_VERTI are the count of how many tiles vertically and horizontally
       They are used for calculating the offset, so we can center them in the preview box
     */
    TILES : {
        "I" : { blocks: [0xF000, 0x2222, 0xF000, 0x2222], color: '#8FB66F', preview: 0x0F00},
        "J" : { blocks: [0x2260, 0x0470, 0x6440, 0x7100], color: '#73adc1', preview: 0x0470},
        "O" : { blocks: [0x6600, 0x6600, 0x6600, 0x6600], color: '#A06288', preview: 0x0660},
        "S" : { blocks: [0x6C00, 0x4620, 0x6C00, 0x4620], color: '#DF443C', preview: 0x06C0},
        "T" : { blocks: [0xE400, 0x2620, 0x04E0, 0x8C80], color: '#CC9D7D', preview: 0x0E40},
        "L" : { blocks: [0x4460, 0x0740, 0x6220, 0x02E0], color: '#FF8336', preview: 0x02E0},
        "Z" : { blocks: [0xC600, 0x2640, 0xC600, 0x2640], color: '#FFCF60', preview: 0X0C60}
    },
    KEY : { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    DIR : { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3},
    SCORE_PER_LINE: 100,
    SCORE_ANIMATE_DURATION: 1000,
    LINE_ANIMATE_DURATION: 350,
    COLOR_WHITE: '#FFFFFF'
}