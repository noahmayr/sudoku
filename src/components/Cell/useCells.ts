import { useMemo } from "react";
import { getKey } from "../../hooks/useSelection";

export type CellIndex = Record<string, CellInterface>;

interface UseCellsProps {
    width: number;
    height: number;
}

const useCells = ({ width, height }: UseCellsProps) => {
    return useMemo(() => {
        const cellIndex: CellIndex = {};
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell: CellInterface = {
                    x: x,
                    y: y,
                    //@ts-ignore
                    given: Math.ceil((Math.random() * 9))
                };
                cellIndex[getKey(cell)] = cell;
            }
        }
        return cellIndex;
    }, [width, height]);
}

export default useCells;