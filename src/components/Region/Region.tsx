import classes from './Cell.module.scss';
import classnames from 'classnames';
import LinePath, { Line } from '../SVG/LinePath';
import Path, { PathCommand } from '../SVG/Path';
import { useEffect, useMemo, useReducer } from 'react';
import { getKey } from '../../hooks/useSelection';

// export type Region = Record<number, Record<number, true>>;
export type RegionCells = Record<string, true>;

// const getKey = (point: Point): string => {
//     return `${point.x}_${point.y}`;
// }

interface RegionProps {
    region: RegionCells;
}

type SimplePath = [Point, Point];

interface PathAction {
    path: SimplePath;
    reset?: true;
}

interface UnoptimizedPathSection {
    start: Point;
    inner: Point[];
    end: Point;
}

interface OptimizedPathSection {
    start: Point;
    path: Vector[];
}

interface PathState {
    incomplete: Record<string, Point[]>;
    complete: OptimizedPathSection[];
}

const useRegionPath = ({ region }: RegionProps): PathCommand[] => {

    const segments = useMemo(() => {
        const paths: SimplePath[] = [];
        for (const cell of Object.keys(region).map((key): Point => JSON.parse(key))) {
            const x = cell.x + 0.5,
                y = cell.y + 0.5;
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
        }

        return paths;
    }, [JSON.stringify(region)]);

    const commands: PathCommand[] = useMemo(() => {
        const index: Record<string, Point[]> = {};
        const complete: Point[][] = [];

        for (const segment of segments) {
            const start = segment[0];
            const end = segment[1];
            const keyStart = getKey(segment[0]);
            const keyEnd = getKey(segment[1]);
            if (!index[keyStart] && !index[keyEnd]) {
                index[keyStart] = segment;
                index[keyEnd] = segment;
                continue;
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
                continue;
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
                continue;
            }
            if (index[keyStart] === index[keyEnd]) {
                const path = index[keyStart];
                complete.push(path);
                delete index[keyStart];
                delete index[keyEnd];
                continue;
            }

            const a = index[keyStart];
            const b = index[keyEnd];

            for (const [key, value] of Object.entries(index)) {
                if ([a, b].includes(value)) {
                    delete index[key];
                }
            }

            const aAtStart = getKey(a[0]) !== keyStart
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
            index[getKey(newPath[0])] = newPath
            index[getKey(newPath[newPath.length - 1])] = newPath;
        }

        const x: PathCommand[][] = complete.map(path => {
            return [...path.map((point, index, points): PathCommand => {
                if (index === 0) {
                    return {
                        type: 'M',
                        vector: point
                    };
                }
                return {
                    type: 'L',
                    vector: point
                };
            }), { type: 'Z' }]
        })

        return x.flat(1);
    }, [segments]);

    // const commands: PathCommand[][] = complete.map((section): PathCommand[] => {
    //     return [{type: 'M', vector: section.start}, ...section.path.map((vector): PathCommand => ({type: 'l', vector}))];
    // });

    return commands;
}

const Region = ({ className, ...props }: RegionProps & HasClassName) => {
    const commands = useRegionPath(props);
    return (
        <Path commands={commands} className={className} />
    )
}

export default Region;