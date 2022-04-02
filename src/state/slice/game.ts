import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Region, Row, Column, PositionMap } from "../types.d";

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
