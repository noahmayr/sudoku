import { useEffect } from "react";
import { CellValue } from "../components/Cell/useCells";
import { GivenDigits, useInputDispatch } from "../context/Input";
import { getKey } from "../util";

export type GameGivens = (CellValue | undefined)[][];
export type GameRegion = (true | undefined)[][];
interface GameRules {
    regions?: GameRegion[];
    rows?: Point[];
    columns?: Point[];
}
export interface Game {
    width?: number;
    height?: number;
    cells?: GameGivens;
    rules?: GameRules;
}

export const STANDARD_RULES: Required<Pick<GameRules, 'regions'|'rows'|'columns'>> = {
    regions: [
        [
            [true,true,true],
            [true,true,true],
            [true,true,true]
        ],
        [
            [,,,true,true,true],
            [,,,true,true,true],
            [,,,true,true,true]
        ],
        [
            [,,,,,,true,true,true],
            [,,,,,,true,true,true],
            [,,,,,,true,true,true]
        ],
        [
            [],
            [],
            [],
            [true,true,true],
            [true,true,true],
            [true,true,true]
        ],
        [
            [],
            [],
            [],
            [,,,true,true,true],
            [,,,true,true,true],
            [,,,true,true,true]
        ],
        [
            [],
            [],
            [],
            [,,,,,,true,true,true],
            [,,,,,,true,true,true],
            [,,,,,,true,true,true]
        ],
        [
            [],
            [],
            [],
            [],
            [],
            [],
            [true,true,true],
            [true,true,true],
            [true,true,true]
        ],
        [
            [],
            [],
            [],
            [],
            [],
            [],
            [,,,true,true,true],
            [,,,true,true,true],
            [,,,true,true,true]
        ],
        [
            [],
            [],
            [],
            [],
            [],
            [],
            [,,,,,,true,true,true],
            [,,,,,,true,true,true],
            [,,,,,,true,true,true]
        ],
    ],
    rows: [
        {x: 0, y:0},
        {x: 0, y:1},
        {x: 0, y:2},
        {x: 0, y:3},
        {x: 0, y:4},
        {x: 0, y:5},
        {x: 0, y:6},
        {x: 0, y:7},
        {x: 0, y:8},
    ],
    columns: [
        {x: 0, y:0},
        {x: 1, y:0},
        {x: 2, y:0},
        {x: 3, y:0},
        {x: 4, y:0},
        {x: 5, y:0},
        {x: 6, y:0},
        {x: 7, y:0},
        {x: 8, y:0},
    ]
}

export const EXAMPLE: Game = {
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
        [, , 9, 1, 8, 2, , ,3],
        [, , , , 6, , 1]
    ],
    rules: STANDARD_RULES
};

const useGame = (game: Game) => {
    const dispatch = useInputDispatch();
    useEffect(() => {
        console.log('loading game');
        dispatch({
            type: 'given',
            values: game.cells?.map((row, y): GivenDigits[] => {
                return row.map((value, x): GivenDigits => {
                    if (value === null) {
                        return {};
                    }
                    return {
                        [getKey({ x, y })]: value
                    };
                });
            }).flat(1).reduce((a, b) => Object.assign(a, b), {}) ?? {}
        })
    }, []);
    return {
        width: game.width ?? 9,
        height: game.height ?? 9,
        // rules: {
        //     regions: game.rules.regions?.map
        // }
    }
}

export default useGame;