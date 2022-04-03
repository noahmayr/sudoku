import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import getKey from "../util/getKey";
import { PositionKey, Region } from "./game";

interface SelectionState {
    region: Region;
    selecting?: boolean;
}

interface RegionPayload {
    region: Region;
}

interface DragPayload {
    position?: Point;
    intersect: boolean;
}

const selectCells = (cells: Region, selecting: boolean, ...keys: PositionKey[]) => {
    if (selecting) {
        keys.forEach(key => cells.add(key));
        return;
    }
    keys.forEach(key => cells.delete(key));
};

export const selectionSlice = createSlice({
    name: "selection",
    initialState: { region: new Set() } as SelectionState,
    reducers: {
        reset: (draft) => {
            draft.region.clear();
            delete draft.selecting;
        },
        region: (draft, action: PayloadAction<RegionPayload>) => {
            draft.region.clear();
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
    },
});

export const selection = selectionSlice.actions;
export default selectionSlice.reducer;

export const selectSelection = (state: RootState) => state.selection.region;

export const useSelectionState = () => useSelector(selectSelection);
