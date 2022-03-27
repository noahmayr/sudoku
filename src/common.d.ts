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

type Point = Vector;

interface Size {
    width: number,
    height: number
}
