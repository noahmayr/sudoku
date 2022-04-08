import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type PositionKey =`${number}|${number}`;
export type PositionMap<T> = Map<PositionKey, T>;
export type Region = Set<PositionKey>;
export type Row = Set<PositionKey>;
export type Column = Set<PositionKey>;

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

export const COLORS = {
    purple: "#673AB7",
    teal: "#009688",
    amber: "#FFC107",
    grey: "#616161",
    orange: "#F57C00",
    green: "#4CAF50",
    blue: "#3F51B5",
    red: "#FF5252",
    brown: "#795548",
    black: "#000",
};
export type ColorNames = keyof typeof COLORS;

export interface GameExtras {
    coloredRegions?: Map<ColorNames, Region>;
}

export interface GameState {
    dimensions: Size;
    grid: PositionMap<Point>;
    rules: Rules;
    extras?: GameExtras
}

export type LoadPayload = GameState;

export const gameSlice = createSlice({
    name: "game",
    initialState: null as GameState|null,
    reducers: { load: (draft, { payload: game }: PayloadAction<LoadPayload>) => game },
});

export const game = gameSlice.actions;

export default gameSlice.reducer;

export const selectGame = {
    grid: (state: RootState) => state.game?.grid,
    dimensions: (state: RootState) => state.game?.dimensions,
    rules: (state: RootState) => state.game?.rules,
};
