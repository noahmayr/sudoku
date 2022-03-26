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

interface Size {
    width: number,
    height: number
}

interface Bounds extends Point, Size {
}

interface GridProps {
    width?: number;
    height?: number;
}


interface Dimensions {
    bounds: Bounds;
    size: Size;
}
