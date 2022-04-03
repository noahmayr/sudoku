import { useCallback } from "react";
import { useSelector } from "react-redux";
import { CellState, selectCell } from "../../state/slice/input";
import { useSelectionDispatch } from "./SelectionProvider";

export interface SelectAllOfTypeProps {
    type: keyof CellState;
    position: Point;
    intersect: boolean;
}

const useSelectAllOfType = () => {
    const inputState = useSelector(selectCell.all);
    const dispatch = useSelectionDispatch();
    return useCallback(({ type, position, intersect }: SelectAllOfTypeProps) => {
        if (inputState === null) {
            return;
        }
        dispatch({
            type: "samevalue",
            position,
            valueType: type,
            intersect,
            inputState,
        });
    }, [inputState, dispatch]);
};

export default useSelectAllOfType;
