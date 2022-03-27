import { getKey, merge } from "../../util";
import { InputState, CellState } from "../Input";
import { CellSelection, SelectionState, SelectionAction } from "./types.d";

const selectCells = (cells: CellSelection, selecting: boolean, keys: string[]): CellSelection => {
    if (keys.length === 0 || keys.every(key => { return !!cells[key] === selecting; })) {
        return cells;
    }
    if (selecting) {
        return merge(cells, ...keys.map((key): CellSelection => { return { [key]: true }; }));
    }
    return Object.fromEntries(
        Object.entries(cells).filter(([key]) => { return !keys.includes(key); }),
    );
};

type CellPredicate = (state: CellState) => unknown

const findCellsWhere = (input: InputState, predicate: CellPredicate) => {
    return Object.entries(input)
        .filter(([, state]) => { return state !== undefined && predicate(state); })
        .map(([key]) => { return key; });
};

const reduceSelection = (state: SelectionState, action: SelectionAction): SelectionState => {
    if (action.type === "reset") {
        return { cells: {} };
    }
    if (action.type === "stop") {
        if (state.selecting === undefined) {
            return state;
        }
        return { cells: state.cells };
    }
    if (action.type === "drag") {
        const { position, intersect } = action;
        const key = position !== undefined ? getKey(position) : undefined;
        const isSelected = key !== undefined ? !!state.cells[key] : undefined;
        const selecting = state.selecting ?? !(intersect && isSelected);

        const keys = key === undefined ? [] : [key];
        if (state.selecting === undefined) {
            const cells = selectCells(intersect ? state.cells : {}, selecting, keys);
            return { cells, selecting };
        }

        const cells = selectCells(state.cells, selecting, keys);

        if (cells === state.cells && selecting === state.selecting) {
            return state;
        }

        return { selecting, cells };
    }
    if (action.type === "samevalue") {
        const { position, inputState, intersect } = action;
        const key = getKey(position);
        const isSelected = !!state.cells[key];

        const cellState = inputState[key];
        if (cellState === undefined) {
            return state;
        }
        const value = cellState.given ?? cellState.value;
        if (value) {
            const keys = findCellsWhere(
                inputState,
                ({ value: val, given: actual = val }) => { return actual === value; },
            );
            const cells = selectCells(state.cells, !(intersect && isSelected), keys);
            if (cells === state.cells) {
                return state;
            }
            return { cells, selecting: state.selecting };
        }
    }

    return state;
};

export default reduceSelection;
