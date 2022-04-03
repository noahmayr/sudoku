import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CellState, selectCell } from "../../state/slice/input";
import { selection } from "../../state/slice/selection";

export interface SelectAllOfTypeProps {
    type: keyof CellState;
    position: Point;
    intersect: boolean;
}

const useSelectAllOfType = () => {
    const inputState = useSelector(selectCell.all);
    const dispatch = useDispatch();

    return useCallback(({ type, position, intersect }: SelectAllOfTypeProps) => {
        if (inputState === null) {
            return;
        }
        dispatch(selection.samevalue({
            position,
            type,
            intersect,
            inputState,
        }));
    }, [inputState, dispatch]);
};

export default useSelectAllOfType;
