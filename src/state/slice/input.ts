import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";
import { RootState } from "../store";
import getKey from "../util/getKey";
import { PositionKey, PositionMap, Region } from "./game";

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// export type AbstractCellValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
// export type AnyCellValue = CellValue | AbstractCellValue;
export type CellColor = unknown;

export interface CellState {
    value?: CellValue;
    center: Set<CellValue>;
    corner: Set<CellValue>;
}

export interface CellStateWithGiven extends CellState {
    isGiven?: boolean;
}

export type InputState = PositionMap<CellStateWithGiven>;

export interface GivenPayload {
    grid: Region;
    givens: PositionMap<CellState["value"]>
}

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
                    const state: CellStateWithGiven = {
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
    byPosition: (position: Point) => cellByKeySelector(getKey(position)),
    byKey: cellByKeySelector,
    byRegion: cellsByRegion,
};
