import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { selectionActions } from "../../state/slice/selection";
import { AppDispatch, AppGetState } from "../../state/store";
import getKey from "../../state/util/getKey";

interface UseDraggingSelectionProps {
    shouldSelect: boolean;
    position?: Position;
    intersect: boolean;
}

const draggingSelectionThunk = (
    { shouldSelect, position, intersect }: UseDraggingSelectionProps,
) => (
    (dispatch: AppDispatch, getState: AppGetState) => {
        const { selection, game } = getState();
        if (game === null) {
            return;
        }
        if (!shouldSelect) {
            if (selection.selecting === undefined) {
                return;
            }
            dispatch(selectionActions.stop());
            return;
        }
        if (position !== undefined && !game.grid.has(getKey(position))) {
            return;
        }
        dispatch(selectionActions.drag({ position, intersect }));
    }
);

const useDraggingSelection = (props: UseDraggingSelectionProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(draggingSelectionThunk(props));
    }, [JSON.stringify(props), dispatch]);
};

export default useDraggingSelection;
