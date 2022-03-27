import { useEffect } from "react";
import { useSelectionDispatch } from "./SelectionProvider";

interface UseDraggingSelectionProps {
    shouldSelect: boolean;
    position?: Point;
    intersect: boolean;
}

const useDraggingSelection = ({ shouldSelect, position, intersect }: UseDraggingSelectionProps) => {
    const dispatch = useSelectionDispatch();

    useEffect(() => {
        if (!shouldSelect) {
            return dispatch({ type: 'stop' });
        }
        dispatch({ type: 'drag', position, intersect });
    }, [shouldSelect, JSON.stringify(position), dispatch, intersect]);
}

export default useDraggingSelection;