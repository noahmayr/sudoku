import { useMemo } from "react";
import { getKey, range } from "../../util";


interface UseCellsProps {
    width: number;
    height: number;
}

export type CellInterface = Point;
export type CellIndex = Record<string, CellInterface>;

const useCells = ({ width, height }: UseCellsProps) => {
    return useMemo(() => {
        const cellIndex: CellIndex = {};
        range(height).forEach(y => {
            range(height).forEach(x => {
                const cell: CellInterface = {
                    x,
                    y,
                };
                cellIndex[getKey(cell)] = cell;
            });
        });
        return cellIndex;
    }, [width, height]);
};

export default useCells;
