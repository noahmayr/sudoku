import { PortableGame } from "../load";
import { Region, Rules, PositionMap, ColorNames } from "../../slice/game";
import { CellValue } from "../../slice/input";
import getKey from "../../util/getKey";
import { range } from "../../../util";
import { GameRegion, GameRules, MinifiedGame } from "../../../hooks/useGame";

export const decompressRegion = (region: GameRegion): Region => {
    const result: Region = new Set();
    region.forEach((rows, y) => {
        rows.forEach((included, x) => {
            if (included) {
                result.add(getKey({ x: x + 1, y: y + 1 }));
            }
        });
    });
    return result;
};

export const convertRules = (rules: GameRules|undefined): Rules => {
    return {
        regions: rules?.regions?.map(decompressRegion),
        rows: rules?.rows?.map(
            ({ x, y }) => new Set(range(9, 1).map(
                offset => getKey({ x: x + offset, y: y + 1 }),
            )),
        ),
        columns: rules?.columns?.map(
            ({ x, y }) => new Set(range(9, 1).map(
                offset => getKey({ x: x + 1, y: y + offset }),
            )),
        ),
    };
};

export const convertGame = (minified: MinifiedGame): PortableGame => {
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

    return {
        board: {
            dimensions: {
                width,
                height,
            },
            grid,
            rules: convertRules(minified.rules),
            extras: {
                coloredRegions: minified.extra?.coloredRegions ? new Map(
                    Object.entries(minified.extra?.coloredRegions).map(
                        ([color, region]) => [color as ColorNames, decompressRegion(region)],
                    ),
                ) : undefined,
            },
        },
        givens,
    };
};
