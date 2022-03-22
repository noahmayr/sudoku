export const merge = <T extends object>(main: T, ...changes: T[]): T => {
    return Object.assign({...main}, ...changes);
};