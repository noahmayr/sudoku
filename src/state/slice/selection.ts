import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import getKey, { decodeKey } from "../util/getKey";
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

interface MovePayload {
    direction: "left"|"right"|"up"|"down";
    size: Size;
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
        move: (draft, action: PayloadAction<MovePayload>) => {
            const { direction, intersect, size } = action.payload;
            const last = Array.from(draft.region).pop();
            if (last === undefined) {
                draft.region.add(getKey({ x: 1, y: 1 }));
                return;
            }

            const { x, y } = decodeKey(last);

            let key: PositionKey;

            switch (direction) {
            case "left":
                key = getKey({ x: x > 1 ? x - 1 : size.width, y });
                break;
            case "right":
                key = getKey({ x: x < size.width ? x + 1 : 1, y });
                break;
            case "up":
                key = getKey({ x, y: y > 1 ? y - 1 : size.height });
                break;
            case "down":
                key = getKey({ x, y: y < size.height ? y + 1 : 1 });
                break;
            default:
                return;
            }

            if (!intersect) {
                draft.region.clear();
            }

            // since we can't add a key to the set twice,
            // we remove it and readd it to move the cursor when it's in the selection
            if (draft.region.has(key)) {
                draft.region.delete(key);
            }
            draft.region.add(key);
        },
        stop: (draft) => {
            delete draft.selecting;
        },
    },
});

export const selectionActions = selectionSlice.actions;
export default selectionSlice.reducer;

export const selectSelection = (state: RootState) => state.selection.region;

export const useSelectionState = () => useSelector(selectSelection);
