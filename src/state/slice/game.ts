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

export interface GameState {
    dimensions: Size;
    grid: PositionMap<Point>;
    rules: Rules;
}

export type LoadPayload = GameState;

export const gameSlice = createSlice({
    name: "game",
    initialState: null as GameState|null,
    reducers: { load: (draft, { payload: settings }: PayloadAction<LoadPayload>) => settings },
});

export const game = gameSlice.actions;

export default gameSlice.reducer;

export const selectGame = {
    grid: (state: RootState) => state.game?.grid,
    dimensions: (state: RootState) => state.game?.dimensions,
    rules: (state: RootState) => state.game?.rules,
};
