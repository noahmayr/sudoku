import { merge } from "../../util";
import { AnyCellValue, CellState, InitAction, InputCenterAction, InputCornerAction, InputState, InputValueAction, ReducerAction } from "./types";

interface SelectedCell {
    key: string;
    state?: CellState;
}

type Changes = InputState[];

type ChangeCallback<K extends keyof CellState> = (state: CellState[K]) => CellState[K];
type ChangeTo<K extends keyof CellState> = CellState[K] | ChangeCallback<K>;

const update = <K extends keyof CellState>(type: K, selection: SelectedCell[], changeTo: ChangeTo<K>): Changes => {
    const changes = selection.map(({ key, state: { [type]: state, ...other } = {} }) => {
        const value = changeTo instanceof Function ? changeTo(state) : changeTo;
        if (value === undefined) {
            return { [key]: other };
        }
        return {
            [key]: { ...other, [type]: value }
        }
    });
    return changes;
}

const createFilter = <K extends keyof CellState>(type: K, filterCallback: (state: CellState[K]) => unknown) => {
    return ({ state = {} }: SelectedCell) => filterCallback(state[type]);
}

const initAction = ({ values }: InitAction): Changes => {
    return Object.entries(values).map(([key, value]): InputState => {
        return {
            [key]: {
                given: value
            }
        }
    });
}

const valueAction = (selection: SelectedCell[], { type, value }: InputValueAction): Changes => {
    // delete value from all selected cells that are not empty
    if (value === undefined) {
        const notEmpty = selection.filter(createFilter(type, state => state !== undefined));
        return update(type, notEmpty, value);
    }

    const withoutValue = selection.filter(createFilter(type, state => state !== value));

    // some selected cells do not have the value, assign it to them
    if (withoutValue.length > 0) {
        return update(type, withoutValue, value);
    }

    // all selected cells have the value, remove it from them
    return update(type, selection, undefined);
}

const markAction = (selection: SelectedCell[], { type, value }: InputCenterAction | InputCornerAction): InputState[] => {
    // delete all marks of type from any cells that have any
    if (value === undefined) {
        const notEmpty = selection.filter(createFilter(type, state => state?.size));
        return update(type, notEmpty, new Set());
    }

    const withoutValue = selection.filter(createFilter(type, state => !state?.has(value)));

    // some selected cells do not have the mark, add it to them
    if (withoutValue.length > 0) {
        return update(type, withoutValue, (old) => {
            const state = new Set(old);
            state.add(value);
            return state;
        });
    }

    // all selected cells have the mark, remove it from them
    return update(type, selection, (old) => {
        const state = new Set(old);
        state.delete(value);
        return state;
    });
}

const reduceInputState = (oldState: InputState, action: ReducerAction): InputState => {
    if (action.type === 'given') {
        return merge({}, ...initAction(action));
    }

    const selection: SelectedCell[] = Object.keys(action.selection).map(key => {
        return { key, state: oldState[key] }
    }).filter(cell => cell.state?.given === undefined || action.type === 'color');

    if (selection.length === 0) {
        return oldState;
    }

    switch (action.type) {
        case 'value':
            return merge(oldState, ...valueAction(selection, action));
        case 'center':
        case 'corner':
            return merge(oldState, ...markAction(selection, action));
    }
    
    return oldState;
}

export default reduceInputState;
