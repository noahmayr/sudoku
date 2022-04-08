/* eslint-disable no-sparse-arrays */
import { MinifiedGame } from "./useGame";

// eslint-disable-next-line import/prefer-default-export
export const SAMURAI_SUDOKU: MinifiedGame = {
    width: 21,
    height: 21,
    cells: [
        [3,,,,,,,, 7,,,, 6, 5,,,,, 1],
        [,, 6,,, 9,,,,,,,,, 8,, 7,, 3, 9],
        [9, 2, 1,,,, 4,, 8,,,,,,,, 3,,,, 6],
        [1,,, 8,,,,,,,,,,, 5, 7,, 2],
        [, 4,, 6,,,, 2,,,,, 4,,, 8,,,,, 9],
        [, 3,, 4, 7,,,,,,,,,,,,,, 8,, 1],
        [,, 5,,, 2,,,,, 5,,,,,,, 3],
        [2,, 4, 3,,,,,,,,,,,,,, 7],
        [,,,, 6,,,,,,,,,,, 2,,,,, 8],

        [,,,,,, 9,,, 6],
        [,,,,,, 4, 3,,, 7, 5,,, 6],
        [,,,,,,,,,, 9,, 8],

        [,,, 9, 2,,,,,,,,,,,, 3,, 8],
        [,,, 8,,,,, 7,,,,,,,,, 6,, 3],
        [,,,,, 4,, 9,,,,, 6,,,,,,,, 2],
        [, 4,,,,,, 1,,,,,, 6,,,,,, 7],
        [,,,, 8,,,, 2,,,,, 8, 1,,,, 5],
        [, 9, 7,,,,,,,,,,,, 3,,, 1],
        [,,,, 5,,, 6,,,,, 9,,,,, 8,, 6, 4],
        [3, 8,,,,,,, 1,,,,,,, 1],
        [6,,,, 1,,, 4, 5,,,,,,, 2,, 4,, 5],
    ],
    rules: {
        regions: [
            [
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [],
                [],
                [],
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],

            [
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],


            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [true, true, true],
                [true, true, true],
                [true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,, true, true, true],
                [,,, true, true, true],
                [,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],

            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,,,,,,,, true, true, true],
            ],


            [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
                [,,,,,, true, true, true],
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
                [,,,,,,,,,,,, true, true, true],
            ],


        ],
        rows: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 },
            { x: 0, y: 5 },
            { x: 0, y: 6 },
            { x: 0, y: 7 },
            { x: 0, y: 8 },

            { x: 12, y: 0 },
            { x: 12, y: 1 },
            { x: 12, y: 2 },
            { x: 12, y: 3 },
            { x: 12, y: 4 },
            { x: 12, y: 5 },
            { x: 12, y: 6 },
            { x: 12, y: 7 },
            { x: 12, y: 8 },

            { x: 0, y: 12 },
            { x: 0, y: 13 },
            { x: 0, y: 14 },
            { x: 0, y: 15 },
            { x: 0, y: 16 },
            { x: 0, y: 17 },
            { x: 0, y: 18 },
            { x: 0, y: 19 },
            { x: 0, y: 20 },

            { x: 12, y: 12 },
            { x: 12, y: 13 },
            { x: 12, y: 14 },
            { x: 12, y: 15 },
            { x: 12, y: 16 },
            { x: 12, y: 17 },
            { x: 12, y: 18 },
            { x: 12, y: 19 },
            { x: 12, y: 20 },

            { x: 6, y: 6 },
            { x: 6, y: 7 },
            { x: 6, y: 8 },
            { x: 6, y: 9 },
            { x: 6, y: 10 },
            { x: 6, y: 11 },
            { x: 6, y: 12 },
            { x: 6, y: 13 },
            { x: 6, y: 14 },
        ],
        columns: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
            { x: 7, y: 0 },
            { x: 8, y: 0 },

            { x: 0, y: 12 },
            { x: 1, y: 12 },
            { x: 2, y: 12 },
            { x: 3, y: 12 },
            { x: 4, y: 12 },
            { x: 5, y: 12 },
            { x: 6, y: 12 },
            { x: 7, y: 12 },
            { x: 8, y: 12 },

            { x: 12, y: 0 },
            { x: 13, y: 0 },
            { x: 14, y: 0 },
            { x: 15, y: 0 },
            { x: 16, y: 0 },
            { x: 17, y: 0 },
            { x: 18, y: 0 },
            { x: 19, y: 0 },
            { x: 20, y: 0 },

            { x: 12, y: 12 },
            { x: 13, y: 12 },
            { x: 14, y: 12 },
            { x: 15, y: 12 },
            { x: 16, y: 12 },
            { x: 17, y: 12 },
            { x: 18, y: 12 },
            { x: 19, y: 12 },
            { x: 20, y: 12 },

            { x: 6, y: 6 },
            { x: 7, y: 6 },
            { x: 8, y: 6 },
            { x: 9, y: 6 },
            { x: 10, y: 6 },
            { x: 11, y: 6 },
            { x: 12, y: 6 },
            { x: 13, y: 6 },
            { x: 14, y: 6 },
        ],
    },
    extra: {
        coloredRegions: {
            amber: [
                [],
                [],
                [],
                [],
                [],
                [],
                [,,,,,, true, true, true,,,, true, true, true],
                [,,,,,, true, true, true,,,, true, true, true],
                [,,,,,, true, true, true,,,, true, true, true],
                [],
                [],
                [],
                [,,,,,, true, true, true,,,, true, true, true],
                [,,,,,, true, true, true,,,, true, true, true],
                [,,,,,, true, true, true,,,, true, true, true],
            ],
            black: [
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [],
                [],
                [],
                [true, true, true, true, true, true,,,,,,,,,, true, true, true, true, true, true],
                [true, true, true, true, true, true,,,,,,,,,, true, true, true, true, true, true],
                [true, true, true, true, true, true,,,,,,,,,, true, true, true, true, true, true],
                [],
                [],
                [],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
                [,,,,,,,,, true, true, true],
            ],
        },
    },
};
