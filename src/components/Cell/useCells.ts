import { useMemo } from "react";
import { getKey } from "../../hooks/useSelection";

export type CellIndex = Record<string, CellInterface>;

interface UseCellsProps {
    width: number;
    height: number;
}

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type AbstractCellValue = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
export enum CellColor {
    lightgray,
    darkgray,
    red,
    orange,
    yellow,
    green,
    teal,
    blue,
    purple
}

export interface CellInterface extends Point {
    value?: CellValue | AbstractCellValue;
    given?: CellValue;
    // pencilMark?: {
    //     center: CellValue | AbstractCellValue;
    //     corner: CellValue | AbstractCellValue;
    // }
    // color?: CellColor;
};

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