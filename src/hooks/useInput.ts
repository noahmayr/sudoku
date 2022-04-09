import { useDispatch, useSelector } from "react-redux";
import { selectGame } from "../state/slice/game";
import { CellState, CellValue, inputActions } from "../state/slice/input";
import { selectionActions, useSelectionState } from "../state/slice/selection";
import { ModifierKeys } from "./useMouse";
import useOnGlobalDomEvent from "./useOnGlobalDomEvent";
import { shouldIntersect } from "./useSelection";

const CELL_VALUES: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function isCellValue(value: number): value is CellValue {
    return CELL_VALUES.includes(value as CellValue);
}

const getCellValue = (value: number): CellValue|undefined => {
    if (isCellValue(value)) {
        return value;
    }
    return undefined;
};

export const getModifiers = (
    { metaKey: meta, ctrlKey: ctrl, shiftKey: shift, altKey: alt }: KeyboardEvent|MouseEvent,
): ModifierKeys => {
    return {
        meta, ctrl, shift, alt,
    };
};

export const getType = (mods: ModifierKeys): keyof CellState => {
    const center = mods.meta || mods.ctrl;
    const corner = mods.alt || mods.shift;

    if (center && corner) {
        return "color";
    }
    if (center) {
        return "center";
    }
    if (corner) {
        return "corner";
    }
    return "value";
};

const useInput = () => {
    const region = useSelectionState();
    const grid = useSelector(selectGame.grid);
    const size = useSelector(selectGame.dimensions);
    const dispatch = useDispatch();
    useOnGlobalDomEvent(["keydown"], (event) => {
        const mods = getModifiers(event);
        const type = getType(mods);
        const intersect = shouldIntersect(mods);

        if (event.code.startsWith("Digit")) {
            event.preventDefault();
            const value = getCellValue(Number(event.code.replace("Digit", "")));
            if (value === undefined) {
                return;
            }
            dispatch(inputActions.value({
                type,
                region,
                value,
            }));
            return;
        }
        if (event.key === "Backspace") {
            event.preventDefault();
            dispatch(inputActions.delete({
                type,
                region,
            }));
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            dispatch(selectionActions.reset());
        }

        if (event.key === "a" && mods.meta) {
            event.preventDefault();
            dispatch(selectionActions.region({ region: new Set(grid?.keys()) }));
        }
        if (size !== undefined) {
            if (event.key.toLocaleLowerCase() === "w" || event.key === "ArrowUp") {
                event.preventDefault();
                dispatch(selectionActions.move({
                    intersect, direction: "up", size,
                }));
            }
            if (event.key.toLocaleLowerCase() === "s" || event.key === "ArrowDown") {
                event.preventDefault();
                dispatch(selectionActions.move({
                    intersect, direction: "down", size,
                }));
            }
            if (event.key.toLocaleLowerCase() === "a" || event.key === "ArrowLeft") {
                event.preventDefault();
                dispatch(selectionActions.move({
                    intersect, direction: "left", size,
                }));
            }
            if (event.key.toLocaleLowerCase() === "d" || event.key === "ArrowRight") {
                event.preventDefault();
                dispatch(selectionActions.move({
                    intersect, direction: "right", size,
                }));
            }
        }
    }, [region, dispatch]);
};

export default useInput;
