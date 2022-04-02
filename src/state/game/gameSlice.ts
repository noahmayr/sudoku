import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellInterface } from "../../components/Cell/useCells";
import { Region, Row, Column, PositionMap } from "../types.d";

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/*
 * export type AbstractCellValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
 * export type AnyCellValue = CellValue | AbstractCellValue;
 */
export type CellColor = unknown;

export interface CellState {
    isGiven: boolean;
    value?: CellValue;
    center: Set<CellValue>;
    corner: Set<CellValue>;
}

type CellValueKeys = Exclude<keyof CellState, "isGiven">

interface HistoricState<T> {
    past: T[];
    current: T;
    future: T[];
}

export interface Rules {
    regions?: Region[];
    rows?: Row[];
    columns?: Column[];
}

export interface GameSettings {
    dimensions: Size;
    grid: PositionMap<Point>;
    rules: Rules;
}

export interface GameState {
    settings: GameSettings;
    cells: PositionMap<CellState>;
}

export interface InitPayload {
    settings: GameSettings;
    givens: PositionMap<CellState["value"]>
}

export interface RemovePayload {
    type: CellValueKeys;
    region: Region;
}

export interface InputPayload extends RemovePayload {
    value: Required<CellState>["value"];
}

export const gameSlice = createSlice({
    name: "game",
    initialState: null as GameState|null,
    reducers: {
        loadGame: (draft, action: PayloadAction<InitPayload>) => {
            const { settings, givens } = action.payload;
            const cells = new Map(Array.from(settings.grid.keys()).map(
                key => {
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
            return {
                settings,
                cells,
            };
        },
        input: (draft, action: PayloadAction<InputPayload>) => {
            if (draft === null) {
                return;
            }
            const { region, type, value } = action.payload;
            const selection = Array.from(draft.cells)
                .filter(([key, state]) => region.has(key) && !state.isGiven)
                .map(([, state]) => state);
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
        },
        remove: (draft, action: PayloadAction<RemovePayload>) => {
            if (draft === null) {
                return;
            }
            const { region, type } = action.payload;
            const selection = Array.from(draft.cells)
                .filter(([key, state]) => region.has(key) && !state.isGiven)
                .map(([, state]) => state);
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
        },
    },
});

// Action creators are generated for each case reducer function
export const { loadGame, input, remove } = gameSlice.actions;

export default gameSlice.reducer;
