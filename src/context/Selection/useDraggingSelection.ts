import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { selection } from "../../state/slice/selection";

interface UseDraggingSelectionProps {
    shouldSelect: boolean;
    position?: Point;
    intersect: boolean;
}

const useDraggingSelection = ({ shouldSelect, position, intersect }: UseDraggingSelectionProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!shouldSelect) {
            dispatch(selection.stop());
            return;
        }
        dispatch(selection.drag({ position, intersect }));
    }, [shouldSelect, JSON.stringify(position), dispatch, intersect]);
};

export default useDraggingSelection;
