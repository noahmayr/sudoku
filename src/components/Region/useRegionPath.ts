import { useMemo } from "react";
import { PositionKey, Region } from "../../state/slice/game";
import { CellValue } from "../../state/slice/input";
import { getKey } from "../../util";
import { PathCommand } from "../SVG/Path";

export type RegionCells = Record<string, true>;

type SimplePath = [Point, Point];

export interface UseRegionPathProps {
    region: RegionCells|Region;
}

const decodeKey = (key: PositionKey): Point => {
    const values = key.split("|").map((val) => parseInt(val)) as [CellValue, CellValue];
    return {
        x: values[0],
        y: values[1],
    };
};

const convert = (region: Region): RegionCells => (
    Array.from(
        region,
        (key): RegionCells => {
            return { [JSON.stringify(decodeKey(key))]: true };
        },
    ).reduce(
        (acc, cell) => Object.assign(acc, cell),
        {},
    )
);

const useRegionPath = ({ region: newRegion }: UseRegionPathProps): PathCommand[] => {
    const region = newRegion instanceof Set ? convert(newRegion) : newRegion;
    const segments = useMemo(() => {
        const paths: SimplePath[] = [];
        Object.keys(region).map((key): Point => JSON.parse(key)).forEach(cell => {
            const x = cell.x + 0.5;
            const y = cell.y + 0.5;
            const topLeft = { x: x - 0.5, y: y - 0.5 };
            const bottomLeft = { x: x - 0.5, y: y + 0.5 };
            const topRight = { x: x + 0.5, y: y - 0.5 };
            const bottomRight = { x: x + 0.5, y: y + 0.5 };
            if (!region[getKey({ ...cell, x: cell.x - 1 })]) {
                paths.push([topLeft, bottomLeft]);
            }
            if (!region[getKey({ ...cell, x: cell.x + 1 })]) {
                paths.push([bottomRight, topRight]);
            }
            if (!region[getKey({ ...cell, y: cell.y - 1 })]) {
                paths.push([topRight, topLeft]);
            }
            if (!region[getKey({ ...cell, y: cell.y + 1 })]) {
                paths.push([bottomLeft, bottomRight]);
            }
        });

        return paths;
    }, [JSON.stringify(region)]);

    const commands: PathCommand[] = useMemo(() => {
        const index: Record<string, Point[]> = {};
        const complete: Point[][] = [];

        segments.forEach(segment => {
            const start = segment[0];
            const end = segment[1];
            const keyStart = getKey(segment[0]);
            const keyEnd = getKey(segment[1]);
            if (!index[keyStart] && !index[keyEnd]) {
                index[keyStart] = segment;
                index[keyEnd] = segment;
                return;
            }
            if (!index[keyStart]) {
                const other = index[keyEnd];
                if (getKey(other[0]) === keyEnd) {
                    other.unshift(start);
                } else {
                    other.push(start);
                }
                delete index[keyEnd];
                index[keyStart] = other;
                return;
            }
            if (!index[keyEnd]) {
                const other = index[keyStart];
                if (getKey(other[0]) === keyStart) {
                    other.unshift(end);
                } else {
                    other.push(end);
                }
                delete index[keyStart];
                index[keyEnd] = other;
                return;
            }
            if (index[keyStart] === index[keyEnd]) {
                const path = index[keyStart];
                complete.push(path);
                delete index[keyStart];
                delete index[keyEnd];
                return;
            }

            const a = index[keyStart];
            const b = index[keyEnd];

            Object.entries(index)
                .filter(([, value]) => [a, b].includes(value))
                .forEach(([key]) => {
                    delete index[key];
                });

            const aAtStart = getKey(a[0]) !== keyStart;
            const bAtEnd = getKey(b[b.length - 1]) !== keyEnd;

            let newPath: Point[];

            if (aAtStart && bAtEnd) {
                newPath = [...a, ...b];
            } else if (bAtEnd) {
                newPath = [...a.reverse(), ...b];
            } else if (aAtStart) {
                newPath = [...b, ...a.reverse()];
            } else {
                newPath = [...b, ...a];
            }
            index[getKey(newPath[0])] = newPath;
            index[getKey(newPath[newPath.length - 1])] = newPath;
        });
        const x: PathCommand[][] = complete.map(path => [
            ...path.map((point, idx): PathCommand => {
                if (idx === 0) {
                    return {
                        type: "M",
                        vector: point,
                    };
                }
                return {
                    type: "L",
                    vector: point,
                };
            }),
            { type: "Z" },
        ]);

        return x.flat(1);
    }, [segments]);
    return commands;
};

export default useRegionPath;
