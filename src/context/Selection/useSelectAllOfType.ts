import { useCallback } from "react";
import { getKey } from "../../util";
import { CellState, InputState, useInputState } from "../Input";
import { useSelectionDispatch } from "./SelectionProvider";

export interface SelectAllOfTypeProps {
    type: keyof CellState;
    position: Point;
    intersect: boolean;
}

const useSelectAllOfType = () => {
    const inputState = useInputState();
    const dispatch = useSelectionDispatch();
    return useCallback(({type, position, intersect}: SelectAllOfTypeProps) => {
        dispatch({
            type: 'samevalue',
            position,
            valueType: type,
            intersect: intersect,
            inputState
        })
    }, [JSON.stringify(inputState), dispatch]);
}

export default useSelectAllOfType;
