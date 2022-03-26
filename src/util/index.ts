export const merge = <T extends object>(main: T, ...changes: T[]): T => {
    if (changes.length === 0) {
        return main;
    }
    return Object.assign({...main}, ...changes);
};