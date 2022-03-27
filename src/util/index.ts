export const merge = <T extends object>(main: T, ...changes: T[]): T => {
    if (changes.length === 0) {
        return main;
    }
    return Object.assign({ ...main }, ...changes);
};

export const getKey = ({ x, y }: Point): string => { return JSON.stringify({ x, y }); };

export const range = (length: number) => { return Array.from(Array(length).keys()); };
