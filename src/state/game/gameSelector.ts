import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PositionKey } from "../types.d";
import getKey from "../util/getKey";
import { CellState, Rules } from "./gameSlice";

const settingsSelector = (state: RootState) => state.game?.settings;
const cellSelector = (state: RootState) => state.game?.cells;

export const selectDimensions = createSelector(
    settingsSelector,
    settings => settings?.dimensions,
);

export const selectGrid = createSelector(
    settingsSelector,
    settings => settings?.grid,
);

export const selectCellPositionByKey = createSelector(
    [
        settingsSelector,
        (_, key: PositionKey) => key,
    ],
    (settings, key) => settings?.grid.get(key),
);

export const selectRules = createSelector(
    settingsSelector,
    settings => settings?.rules,
);

export const selectRule = createSelector(
    [
        settingsSelector,
        (_, rule: keyof Rules) => rule,
    ],
    settings => settings?.rules,
);

export const selectCellByKey = createSelector(
    [
        cellSelector,
        (state, key: PositionKey) => key,
    ],
    (cells, key): CellState|undefined => cells?.get(key),
);

export const selectCellByPosition = createSelector(
    [
        cellSelector,
        (state, point: Point) => getKey(point),
    ],
    (cells, key): CellState|undefined => cells?.get(key),
);
