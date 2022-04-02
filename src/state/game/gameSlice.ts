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

export interface InputPayload {
    type: CellValueKeys;
    region: Region;
    value?: CellState["value"];
}

export interface DeletePayload {
    type: CellValueKeys;
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
            if (value === undefined) {
                selection.forEach(state => {
                    if (type === "corner" || type === "center") {
                        state[type].clear();
                        return;
                    }
                    delete state[type];
                });
                return;
            }
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
    },
});

// Action creators are generated for each case reducer function
export const { loadGame, input } = gameSlice.actions;

export default gameSlice.reducer;
