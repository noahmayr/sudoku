/* eslint-disable no-sparse-arrays */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CellValue, GivenDigits, useInputDispatch } from "../context/Input";
import { InitPayload, loadGame } from "../state/game/gameSlice";
import { PositionMap, Region } from "../state/types.d";
import { getKey, range } from "../util";
import newGetKey from "../state/util/getKey";

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

export const EASY_GAME: Game = {
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

export const HARD_GAME: Game = {
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

const transformGame = (raw: Game): InitPayload => {
    const { width = 9, height = 9, cells } = raw;
    const grid: PositionMap<Point> = new Map();
    const givens: PositionMap<CellValue> = new Map();
    range(height).map((y): Point[] => range(width).map(
        (x): Point => {
            return {
                x,
                y,
            };
        },
    )).flat(1).forEach(
        (cell) => {
            const key = newGetKey(cell);
            grid.set(key, cell);

            const given = cells?.[cell.y]?.[cell.x];
            if (given !== undefined) {
                givens.set(key, given);
            }
        },
    );
    return {
        settings: {
            dimensions: {
                width,
                height,
            },
            grid,
            rules: {
                regions: raw.rules?.regions?.map((region) => {
                    const result: Region = new Set();
                    region.forEach((rows, y) => {
                        rows.forEach((included, x) => {
                            if (included) {
                                result.add(newGetKey({ x, y }));
                            }
                        });
                    });
                    return result;
                }),
            },
        },
        givens,
    };
};

const useGame = (game: Game) => {
    const inputDispatch = useInputDispatch();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGame(transformGame(game)));
        inputDispatch({
            type: "given",
            values: game.cells?.map((row, y): GivenDigits[] => row.map((value, x): GivenDigits => {
                if (value === null) {
                    return {};
                }
                return { [getKey({ x, y })]: value };
            })).flat(1).reduce((a, b) => Object.assign(a, b), {}) ?? {},
        });
    }, []);
    return {
        width: game.width ?? 9,
        height: game.height ?? 9,
        /*
         * rules: {
         *     regions: game.rules.regions?.map
         * }
         */
    };
};

export default useGame;
