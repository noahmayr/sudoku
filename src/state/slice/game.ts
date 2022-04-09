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

export const COLORS = {
    blue: "#1976D2",
    teal: "#009688",
    green: "#4CAF50",
    amber: "#FFC107",
    orange: "#F57C00",
    red: "#FF5252",
    purple: "#673AB7",
    brown: "#5D4037",
    grey: "#616161",
    black: "#000",
};
export type ColorNames = keyof typeof COLORS;

export interface GameExtras {
    coloredRegions?: Map<ColorNames, Region>;
}

export interface GameSettings {
    dimensions: Size;
    grid: PositionMap<Point>;
    rules: Rules;
    extras?: GameExtras
}

export type LoadPayload = GameSettings;

export const gameSlice = createSlice({
    name: "game",
    initialState: null as GameSettings|null,
    reducers: { load: (draft, { payload: game }: PayloadAction<LoadPayload>) => game },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;

export const selectGame = {
    grid: (state: RootState) => state.game?.grid,
    dimensions: (state: RootState) => state.game?.dimensions,
    rules: (state: RootState) => state.game?.rules,
};
