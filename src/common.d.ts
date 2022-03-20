type KeyOf<T> = keyof T;
type ValueOf<T> = T[KeyOf<T>];
type ValueForKey<T, K extends KeyOf<T>> = T[K]; 

interface HasClassName {
    className?: string;
}

interface Vector {
    x: number;
    y: number;
}

interface Point extends Vector {};

type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type AbstractCellValue = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
enum CellColor {
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

interface CellInterface extends Point {
    value?: CellValue | AbstractCellValue;
    given?: CellValue;
    pencilMark?: {
        center: CellValue | AbstractCellValue;
        corner: CellValue | AbstractCellValue;
    }
    color?: CellColor;
    errors?: string[];
    selected?: boolean;
};

interface Size {
    width: number,
    height: number
}

interface Bounds extends Point, Size {
}

interface GridProps {
    width?: number;
    height?: number;
    scale?: number;
}


interface Dimensions {
    bounds: Bounds;
    size: Size;
}
