import { useDispatch, useSelector } from "react-redux";
import { CellIndex } from "../components/Cell/useCells";
import { selectGame } from "../state/slice/game";
import { CellState, CellValue, input } from "../state/slice/input";
import { selection, useSelectionState } from "../state/slice/selection";
import { ModifierKeys } from "./useMouse";
import useOnGlobalDomEvent from "./useOnGlobalDomEvent";

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

// TODO: map modifier key combinations to cellstate types
export const getType = (mods: ModifierKeys): keyof CellState => {
    const meta = mods.meta || mods.ctrl;
    // eslint-disable-next-line no-nested-ternary
    return meta ? "center" : mods.shift ? "corner" : "value";
};

const useInput = (cells: CellIndex) => {
    const region = useSelectionState();
    const grid = useSelector(selectGame.grid);
    const dispatch = useDispatch();
    useOnGlobalDomEvent(["keydown"], (event) => {
        const mods = getModifiers(event);
        const type = getType(mods);

        if (event.code.startsWith("Digit")) {
            event.preventDefault();
            const value = getCellValue(Number(event.code.replace("Digit", "")));
            if (value === undefined) {
                return;
            }
            dispatch(input.value({
                type,
                region,
                value,
            }));
            return;
        }
        if (event.key === "Backspace") {
            event.preventDefault();
            dispatch(input.delete({
                type,
                region,
            }));
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            dispatch(selection.reset());
        }

        if (event.key === "a" && mods.meta) {
            event.preventDefault();
            dispatch(selection.region({ region: new Set(grid?.keys()) }));
        }
    }, [region, dispatch, JSON.stringify(cells)]);
};

export default useInput;
