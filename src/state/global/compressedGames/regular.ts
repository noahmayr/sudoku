import { GameRules, MinifiedGame } from "../../../hooks/useGame";

/* eslint-disable no-sparse-arrays */
export const STANDARD_RULES: Required<Pick<GameRules, "regions"|"rows"|"columns">> = {
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
    ],
};

export const EASY_GAME: MinifiedGame = {
    width: 9,
    height: 9,
    cells: [
        [, , 4, , 5],
        [9, , , 7, 3, 4, 6],
        [, , 3, , 2, 1, , 4, 9],
        [, 3, 5, , 9, , 4, 8],
        [, 9, , , , , , 3],
        [, 7, 6, , 1, , 9, 2],
        [3, 1, , 9, 7, , 2],
        [, , 9, 1, 8, 2, , , 3],
        [, , , , 6, , 1],
    ],
    rules: STANDARD_RULES,
};

export const HARD_GAME: MinifiedGame = {
    width: 9,
    height: 9,
    cells: [
        [, , , , 5,, 7,, 2],
        [8,,,,,,, 6],
        [,,, 1,,,, 5, 4],
        [,,,, 3],
        [1, 3,, 7, 6,,, 8],
        [, 6, 4,,,, 1],
        [3, 1, 2,, 8],
        [, 9,,,, 5],
        [,,,,, 3, 9],
    ],
    rules: STANDARD_RULES,
};