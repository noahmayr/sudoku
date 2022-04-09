import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { PositionKey, Region } from "../../state/slice/game";
import { CellState, InputState } from "../../state/slice/input";
import { selectionActions } from "../../state/slice/selection";
import { AppDispatch, AppGetState } from "../../state/store";
import getKey from "../../state/util/getKey";

export interface SelectAllOfTypeProps {
    type: keyof CellState;
    position: Point;
    intersect: boolean;
}

interface CellPredicateProps {
    key: PositionKey;
    state: CellState;
}

type CellPredicate = ({ key, state }: CellPredicateProps) => unknown

const findCellsWhere = (input: InputState, predicate: CellPredicate) => Array.from(input)
    .filter(([key, state]) => predicate({ key, state }))
    .reduce((set, [key]) => set.add(key), new Set() as Region);

const determineType = (cell: CellState, type: keyof CellState): keyof CellState => {
    if (
        (
            type === "color"
            || ((type === "corner" || type === "center") && cell.value === undefined)
        )
        && cell[type].size
    ) {
        return type;
    }
    if (cell.value !== undefined) {
        return "value";
    }
    if (cell.corner.size) {
        return "corner";
    }
    if (cell.center.size) {
        return "center";
    }
    if (cell.color.size) {
        return "color";
    }
    return type;
};

const samevalueThunk = ({ type: originalType, position }: SelectAllOfTypeProps) => (
    (dispatch: AppDispatch, getState: AppGetState) => {
        const { input } = getState();

        const cell = input?.get(getKey(position));

        if (input === null || cell === undefined) {
            return;
        }

        const type = determineType(cell, originalType);


        if (type === "value") {
            const active = cell[type];
            if (active === undefined) {
                return;
            }
            const region = findCellsWhere(
                input,
                ({ state: { [type]: current } }) => current === active,
            );
            dispatch(selectionActions.region({ region }));
            return;
        }

        if (!cell[type].size) {
            return;
        }

        const region = findCellsWhere(
            input,
            ({ state }) => {
                if (state[type] === undefined || !state[type].size) {
                    return false;
                }
                return Array.from(cell[type]).every((value) => state[type].has(value));
            },
        );
        dispatch(selectionActions.region({ region }));
    }
);

const useSelectAllOfType = () => {
    const dispatch = useDispatch();

    return useCallback(({ type, position, intersect }: SelectAllOfTypeProps) => {
        dispatch(samevalueThunk({
            type, position, intersect,
        }));
    }, [dispatch]);
};

export default useSelectAllOfType;
