import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";
import { RootState } from "../store";
import getKey from "../util/getKey";
import {
    COLORS, gameActions, PositionKey, PositionMap, Region,
} from "./game";

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// export type AbstractCellValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
// export type AnyCellValue = CellValue | AbstractCellValue;

export const CellColors: Record<CellValue, ValueOf<typeof COLORS>> = {
    1: COLORS.blue,
    2: COLORS.teal,
    3: COLORS.green,
    4: COLORS.amber,
    5: COLORS.orange,
    6: COLORS.red,
    7: COLORS.purple,
    8: COLORS.brown,
    9: COLORS.grey,
};

export type CellColor = ValueOf<typeof CellColors>;

export interface CellState {
    value?: CellValue;
    center: Set<CellValue>;
    corner: Set<CellValue>;
    color: Set<CellValue>
}

export interface CellStateWithGiven extends CellState {
    isGiven?: boolean;
}

export type InputState = PositionMap<CellStateWithGiven>;
export type GivenMap = PositionMap<CellState["value"]>;

export type GivenPayload = GivenMap;

export interface RemovePayload {
    type: keyof CellState;
    region: Region;
}

export interface InputPayload extends RemovePayload {
    value: Required<CellState>["value"];
}

type InputReducer<T extends RemovePayload> =
    (draft: InputState|null, action: PayloadAction<T>) => void;

type WithSelection<T extends RemovePayload> = T & {
    selection: CellStateWithGiven[];
}

const selectRegionCells = <T extends RemovePayload>(
    reducer: InputReducer<WithSelection<T>>,
): InputReducer<T> => (
        (draft, action): ReturnType<typeof reducer>|void => {
            const { region } = action.payload;
            if (draft === null) {
                return;
            }
            const selection = Array.from(draft)
                .filter(([key]) => region.has(key))
                .map(([, state]) => state);
            // eslint-disable-next-line consistent-return
            return reducer(draft, { ...action, payload: { ...action.payload, selection } });
        }
    );

export const inputSlice = createSlice({
    name: "input",
    initialState: new Map() as InputState,
    reducers: {
        givens: (draft, { payload }: PayloadAction<GivenPayload>) => {
            payload.forEach((value, key) => {
                const cell = draft.get(key);
                if (cell === undefined) {
                    return;
                }
                cell.isGiven = true;
                cell.value = value;
            });
        },
        value: selectRegionCells((draft, action: PayloadAction<WithSelection<InputPayload>>) => {
            const { selection, type: originalType, value } = action.payload;

            const allHaveValue = selection.every(state => state.value !== undefined);

            const type = allHaveValue && originalType !== "color" ? "value" : originalType;

            const allHaveType = selection.every(state => {
                if (state.value !== undefined && type !== "color" && (type !== "value" || state.isGiven)) {
                    return true;
                }
                if (type === "corner" || type === "center" || type === "color") {
                    return state[type].has(value);
                }
                return state[type] === value;
            });

            if (allHaveType) {
                selection.forEach(state => {
                    if (state.isGiven && type !== "color") {
                        return;
                    }
                    if (type === "color" || ((type === "corner" || type === "center") && state.value === undefined)) {
                        state[type].delete(value);
                        return;
                    }
                    if (type === "value") {
                        delete state[type];
                    }
                });
                return;
            }

            selection.forEach(state => {
                if (state.isGiven && type !== "color") {
                    return;
                }
                if (type === "value") {
                    state[type] = value;
                    return;
                }
                if (type === "color" || ((type === "corner" || type === "center") && state.value === undefined)) {
                    state[type].add(value);
                }
            });
        }),
        delete: selectRegionCells((draft, action: PayloadAction<WithSelection<RemovePayload>>) => {
            const { type, selection } = action.payload;
            const nonEmpty = {
                value: selection.filter(state => state.value !== undefined && !state.isGiven),
                corner: selection.filter(state => state.corner.size),
                center: selection.filter(state => state.center.size),
                color: selection.filter(state => state.color.size),
            };

            if (
                (
                    type === "color"
                    || ((type === "corner" || type === "center") && !nonEmpty.value.length)
                )
                && nonEmpty[type].length
            ) {
                nonEmpty[type].forEach(state => state[type].clear());
                return;
            }
            if (nonEmpty.value.length) {
                nonEmpty.value.forEach(state => delete state.value);
                return;
            }
            if (nonEmpty.center.length) {
                nonEmpty.center.forEach(state => state.center.clear());
                return;
            }
            if (nonEmpty.corner.length) {
                nonEmpty.corner.forEach(state => state.corner.clear());
                return;
            }
            if (nonEmpty.color.length) {
                nonEmpty.color.forEach(state => state.color.clear());
            }
        }),
    },
    extraReducers: (builder) => {
        builder.addCase(gameActions.load, (draft, action) => {
            const { grid } = action.payload;
            return new Map(Array.from(grid.keys()).map(
                (key) => {
                    const state: CellStateWithGiven = {
                        isGiven: false,
                        center: new Set(),
                        corner: new Set(),
                        color: new Set(),
                    };
                    return [key, state];
                },
            ));
        });
    },
});

export const inputActions = inputSlice.actions;
export default inputSlice.reducer;

const cellsSelector = (state: RootState) => state.input;
const cellByKeySelector = (key: PositionKey) => (state: RootState) => state.input.get(key);

const isDefined = <T>(value: T|undefined): value is T => value !== undefined;
const isTupleValueDefined = <K, V>(tuple: [K, V|undefined]): tuple is [K, V] => {
    const [, value] = tuple;
    return isDefined(value);
};

type RegionTuple<T> = [PositionKey, T];

const mapRegion = <T>(region: Region, callback: (key: PositionKey) => T|undefined) => {
    const tuples: RegionTuple<T>[] = Array.from(
        region,
        (key): RegionTuple<T|undefined> => [key, callback(key)],
    ).filter(isTupleValueDefined);
    return new Map(tuples);
};

const cellsByRegion = (region: Region) => createSelector(
    cellsSelector,
    (cells): PositionMap<CellState> => mapRegion(region, key => cells?.get(key)),
    {
        memoizeOptions: {
            resultEqualityCheck: (left: PositionMap<CellState>, right: PositionMap<CellState>) => (
                shallowEqual(
                    Object.fromEntries(left.entries()),
                    Object.fromEntries(right.entries()),
                )
            ),
        },
    },
);

export const selectCell = {
    all: cellsSelector,
    byPosition: (position: Position) => cellByKeySelector(getKey(position)),
    byKey: cellByKeySelector,
    byRegion: cellsByRegion,
};
