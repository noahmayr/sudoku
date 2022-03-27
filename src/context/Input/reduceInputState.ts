import { merge } from "../../util";
import { CellState, InitAction, InputCenterAction, InputCornerAction, InputState, InputValueAction, InputAction } from "./types";

interface SelectedCell {
    key: string;
    state?: CellState;
}
type ActionWithSelection = Extract<InputAction, { selection: unknown }>;

interface WithSelection<T extends ActionWithSelection> {
    type: T["type"];
    value: T["value"];
    selection: SelectedCell[];
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
        };
    });
    return changes;
};

const createFilter = <K extends keyof CellState>(type: K, filterCallback: (state: CellState[K]) => unknown) => {
    return ({ state = {} }: SelectedCell) => filterCallback(state[type]);
};

const initAction = ({ values }: InitAction): Changes => {
    return Object.entries(values).map(([key, value]): InputState => {
        return {
            [key]: {
                given: value
            }
        };
    });
};

const valueAction = ({ type, value, selection }: WithSelection<Required<InputValueAction>>): Changes => {
    const withoutValue = selection.filter(createFilter(type, state => state !== value));

    // some selected cells do not have the value, assign it to them
    if (withoutValue.length > 0) {
        return update(type, withoutValue, value);
    }

    // all selected cells have the value, remove it from them
    return update(type, selection, undefined);
};

const markAction = ({ type, value, selection }: WithSelection<Required<InputCenterAction | InputCornerAction>>): Changes => {
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
};

const deleteAction = ({ type, selection }: WithSelection<ActionWithSelection>): Changes => {
    const types: ActionWithSelection["type"][] = ["value", "center", "corner"];
    if (types.includes(type)) {
        const valueNonEmpty = selection.filter(createFilter("value", state => state !== undefined));
        if (valueNonEmpty.length > 0) {
            return update("value", valueNonEmpty, undefined);
        }
        const centerNonEmpty = selection.filter(createFilter("center", state => state?.size));
        const cornerNonEmpty = selection.filter(createFilter("corner", state => state?.size));
        if ((type !== "corner" && centerNonEmpty.length > 0) || cornerNonEmpty.length === 0) {
            return update("center", centerNonEmpty, undefined);
        }
        return update("corner", cornerNonEmpty, undefined);
    }
    return [];
};

const reduceInputState = (state: InputState, action: InputAction): InputState => {
    if (action.type === "given") {
        return merge({}, ...initAction(action));
    }

    const selection: SelectedCell[] = Object.keys(action.selection).map(key => {
        return { key, state: state[key] };
    }).filter(cell => cell.state?.given === undefined || action.type === "color");

    if (selection.length === 0) {
        return state;
    }

    const {type, value} = action;

    if (value === undefined) {
        return merge(state, ...deleteAction({type: type, value, selection}));
    }

    switch (type) {
    case "value":
        return merge(state, ...valueAction({type, value, selection}));
    case "center":
    case "corner":
        return merge(state, ...markAction({type, value, selection}));
    }

    return state;
};

export default reduceInputState;
