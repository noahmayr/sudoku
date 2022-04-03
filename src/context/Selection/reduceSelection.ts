import { PositionKey, Region } from "../../state/slice/game";
import { CellState, InputState } from "../../state/slice/input";
import getKey from "../../state/util/getKey";
import { SelectionState, SelectionAction } from "./types.d";

const selectCells = (cells: Region, selecting: boolean, keys: PositionKey[]) => {
    if (selecting) {
        keys.forEach(key => cells.add(key));
        return;
    }
    keys.forEach(key => cells.delete(key));
};

type CellPredicate = (state: CellState) => unknown

const findCellsWhere = (input: InputState, predicate: CellPredicate) => Array.from(input)
    .filter(([, state]) => state !== undefined && predicate(state))
    .map(([key]) => key);

const reduceSelection = (draft: SelectionState, action: SelectionAction) => {
    if (action.type === "reset") {
        draft.cells.clear();
        delete draft.selecting;
        return;
    }

    if (action.type === "stop") {
        if (draft.selecting === undefined) {
            return;
        }
        delete draft.selecting;
    }

    if (action.type === "drag") {
        const { position, intersect } = action;
        if (draft.selecting === undefined && !intersect) {
            draft.cells.clear();
        }
        if (position === undefined) {
            return;
        }
        const key = getKey(position);
        const isSelected = draft.cells.has(key);
        const selecting = draft.selecting ?? !(intersect && isSelected);

        selectCells(draft.cells, selecting, [key]);
        draft.selecting = selecting;
        return;
    }

    if (action.type === "samevalue") {
        const { position, inputState, intersect } = action;
        const key = getKey(position);
        const isSelected = draft.cells.has(key);

        const cellState = inputState.get(key);

        if (cellState === undefined) {
            return;
        }

        if (cellState.value) {
            const keys = findCellsWhere(inputState, ({ value }) => value === cellState.value);
            selectCells(draft.cells, !(intersect && isSelected), keys);
            return;
        }
        return;
    }

    if (action.type === "all") {
        selectCells(draft.cells, true, Object.keys(action.cells) as PositionKey[]);
    }
};

export default reduceSelection;
