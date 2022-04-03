import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import getKey from "../util/getKey";
import { PositionKey, Region } from "./game";
import { CellState, InputState } from "./input";

interface SelectionState {
    region: Region;
    selecting?: boolean;
}

interface AllPayload {
    region: Region;
}

interface DragPayload {
    position?: Point;
    intersect: boolean;
}

interface SameValuePayload {
    position: Point;
    type: keyof CellState;
    inputState: InputState;
    intersect: boolean;
}

const selectCells = (cells: Region, selecting: boolean, ...keys: PositionKey[]) => {
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


export const selectionSlice = createSlice({
    name: "selection",
    initialState: { region: new Set() } as SelectionState,
    reducers: {
        reset: (draft) => {
            draft.region.clear();
            delete draft.selecting;
        },
        all: (draft, action: PayloadAction<AllPayload>) => {
            selectCells(draft.region, true, ...Array.from(action.payload.region));
        },
        drag: (draft, action: PayloadAction<DragPayload>) => {
            const { position, intersect } = action.payload;
            if (draft.selecting === undefined && !intersect) {
                draft.region.clear();
            }
            if (position === undefined) {
                return;
            }
            const key = getKey(position);
            const isSelected = draft.region.has(key);
            const selecting = draft.selecting ?? !(intersect && isSelected);

            selectCells(draft.region, selecting, key);
            draft.selecting = selecting;
        },
        stop: (draft) => {
            delete draft.selecting;
        },
        samevalue: (draft, action: PayloadAction<SameValuePayload>) => {
            const { position, inputState, intersect } = action.payload;
            const key = getKey(position);
            const isSelected = draft.region.has(key);

            const cellState = inputState.get(key);

            if (cellState === undefined) {
                return;
            }

            if (cellState.value) {
                const keys = findCellsWhere(inputState, ({ value }) => value === cellState.value);
                selectCells(draft.region, !(intersect && isSelected), ...keys);
            }
        },
    },
});

export const selection = selectionSlice.actions;
export default selectionSlice.reducer;

export const selectSelection = (state: RootState) => state.selection.region;

export const useSelectionState = () => useSelector(selectSelection);
