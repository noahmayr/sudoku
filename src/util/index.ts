export const merge = <T extends object>(main: T, ...changes: T[]): T => {
    if (changes.length === 0) {
        return main;
    }
    return Object.assign({ ...main }, ...changes);
};

export const range = (length: number, start = 0) => Array.from(
    Array(length).keys(),
    (val) => start + val,
);
