import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { range } from "../../util";
import { STANDARD_RULES } from "../global/compressedGames/regular";
import { convertRules } from "../global/compressedGames/util";
import { RootState } from "../store";
import getKey from "../util/getKey";

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
    red: "#ff1744",
    purple: "#7C4DFF",
    brown: "#814731",
    grey: "#888",
    black: "#000",
};
export type ColorNames = keyof typeof COLORS;

export interface GameExtras {
    coloredRegions?: Map<ColorNames, Region>;
}

export interface GameBoard {
    dimensions: Size;
    grid: PositionMap<Position>;
    rules: Rules;
    extras?: GameExtras
}

export type LoadPayload = GameBoard;

const buildGrid = ({ width, height }: Size) => new Map(
    range(width, 1).map(
        x => range(height, 1).map(
            y => {
                return { x, y };
            },
        ),
    ).flat(1).map(
        position => [getKey(position), position],
    ),
);

const STANDARD_SIZE = { width: 9, height: 9 };

export const EMPTY_GAME: GameBoard = {
    dimensions: STANDARD_SIZE,
    grid: buildGrid(STANDARD_SIZE),
    rules: convertRules(STANDARD_RULES),
};

export const gameSlice = createSlice({
    name: "game",
    initialState: null as GameBoard|null,
    reducers: { load: (draft, { payload: game }: PayloadAction<LoadPayload>) => game },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;

export const selectGame = {
    game: (state: RootState) => state.game,
    grid: (state: RootState) => state.game?.grid,
    dimensions: (state: RootState) => state.game?.dimensions,
    rules: (state: RootState) => state.game?.rules,
};
