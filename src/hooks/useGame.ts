/* eslint-disable no-sparse-arrays */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { game, PositionMap, Region } from "../state/slice/game";
import { range } from "../util";
import getKey from "../state/util/getKey";
import { CellValue, input } from "../state/slice/input";
import { AppDispatch } from "../state/store";

export type GameGivens = (CellValue | undefined)[][];
export type GameRegion = (true | undefined)[][];
interface GameRules {
    regions?: GameRegion[];
    rows?: Point[];
    columns?: Point[];
}
export interface MinifiedGame {
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

const loadGameThunk = (minified: MinifiedGame) => async (dispatch: AppDispatch) => {
    const { width = 9, height = 9, cells } = minified;
    const grid: PositionMap<Point> = new Map();
    const givens: PositionMap<CellValue> = new Map();
    range(height, 1).map((y): Point[] => range(width, 1).map(
        (x): Point => {
            return {
                x,
                y,
            };
        },
    )).flat(1).forEach(
        (cell) => {
            const key = getKey(cell);
            grid.set(key, cell);

            const given = cells?.[cell.y - 1]?.[cell.x - 1];
            if (given !== undefined) {
                givens.set(key, given);
            }
        },
    );
    dispatch(game.load({
        dimensions: {
            width,
            height,
        },
        grid,
        rules: {
            regions: minified.rules?.regions?.map((region) => {
                const result: Region = new Set();
                region.forEach((rows, y) => {
                    rows.forEach((included, x) => {
                        if (included) {
                            result.add(getKey({ x: x + 1, y: y + 1 }));
                        }
                    });
                });
                return result;
            }),
            rows: minified.rules?.rows?.map(
                ({ x, y }) => new Set(range(9, 1).map(
                    offset => getKey({ x: x + offset, y: y + 1 }),
                )),
            ),
            columns: minified.rules?.columns?.map(
                ({ x, y }) => new Set(range(9, 1).map(
                    offset => getKey({ x: x + 1, y: y + offset }),
                )),
            ),
        },
    }));
    dispatch(input.givens({ givens, grid: new Set(grid.keys()) }));
};

const useGame = (minified: MinifiedGame) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGameThunk(minified));
    }, []);
    return {
        width: minified.width ?? 9,
        height: minified.height ?? 9,
        // rules: {
        //     regions: game.rules.regions?.map
        // }
    };
};

export default useGame;
