import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
    Region, Row, Column, PositionMap, PositionKey,
} from "../types.d";
import getKey from "../util/getKey";

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// export type AbstractCellValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
// export type AnyCellValue = CellValue | AbstractCellValue;
export type CellColor = unknown;

export interface CellState {
    isGiven: boolean;
    value?: CellValue;
    center: Set<CellValue>;
    corner: Set<CellValue>;
}

type CellValueKeys = Exclude<keyof CellState, "isGiven">

export type InputState = PositionMap<CellState>;

export interface GivenPayload {
    grid: Region;
    givens: PositionMap<CellState["value"]>
}

export interface RemovePayload {
    type: CellValueKeys;
    region: Region;
}

export interface InputPayload extends RemovePayload {
    value: Required<CellState>["value"];
}

type InputReducer<T extends RemovePayload> =
    (draft: InputState|null, action: PayloadAction<T>) => void;

type WithSelection<T extends RemovePayload> = T & {
    selection: CellState[];
}

const selectRegionCells = <T extends RemovePayload>(
    reducer: InputReducer<WithSelection<T>>,
): InputReducer<T> => (
        (draft, action): ReturnType<typeof reducer>|void => {
            if (draft === null) {
                return;
            }
            const selection = Array.from(draft)
                .filter(([key, state]) => action.payload.region.has(key) && !state.isGiven)
                .map(([, state]) => state);
            // eslint-disable-next-line consistent-return
            return reducer(draft, { ...action, payload: { ...action.payload, selection } });
        }
    );

export const inputSlice = createSlice({
    name: "input",
    initialState: null as InputState|null,
    reducers: {
        givens: (draft, action: PayloadAction<GivenPayload>) => {
            const { givens, grid } = action.payload;
            return new Map(Array.from(grid).map(
                (key) => {
                    const state: CellState = {
                        isGiven: givens.has(key),
                        center: new Set<CellValue>(),
                        corner: new Set<CellValue>(),
                    };
                    if (state.isGiven) {
                        state.value = givens.get(key);
                    }
                    return [key, state];
                },
            ));
        },
        value: selectRegionCells((draft, action: PayloadAction<WithSelection<InputPayload>>) => {
            const { selection, type, value } = action.payload;

            const allHaveValue = selection.every(state => {
                if (type === "corner" || type === "center") {
                    return state[type].has(value);
                }
                return state[type] === value;
            });
            if (allHaveValue) {
                selection.forEach(state => {
                    if (type === "corner" || type === "center") {
                        state[type].delete(value);
                        return;
                    }
                    delete state[type];
                });
                return;
            }
            selection.forEach(state => {
                if (type === "corner" || type === "center") {
                    state[type].add(value);
                    return;
                }
                state[type] = value;
            });
        }),
        delete: selectRegionCells((draft, action: PayloadAction<WithSelection<RemovePayload>>) => {
            const { type, selection } = action.payload;

            const valueNonEmpty = selection.filter(state => state.value !== undefined);
            if (valueNonEmpty.length) {
                valueNonEmpty.forEach(state => delete state[type]);
                return;
            }
            const cornerNonEmpty = selection.filter(state => state.corner.size);
            const centerNonEmpty = selection.filter(state => state.center.size);
            if ((type !== "corner" && centerNonEmpty.length > 0) || cornerNonEmpty.length === 0) {
                centerNonEmpty.forEach(state => state.center.clear());
                return;
            }
            cornerNonEmpty.forEach(state => state.corner.clear());
        }),
    },
});

export const input = inputSlice.actions;
export default inputSlice.reducer;

const cellsSelector = (state: RootState) => state.input;
const cellByKeySelector = (key: PositionKey) => (state: RootState) => (
    cellsSelector(state)?.get(key)
);

export const selectCell = {
    all: cellsSelector,
    byPosition: (position: Point) => cellByKeySelector(getKey(position)),
    byKey: cellByKeySelector,
};
