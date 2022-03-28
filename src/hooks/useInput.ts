import { CellIndex } from "../components/Cell/useCells";
import { CellValue, useInputDispatch } from "../context/Input";
import { useSelectionDispatch, useSelectionState } from "../context/Selection";
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

const useInput = (cells: CellIndex) => {
    const dispatch = useInputDispatch();
    const selection = useSelectionState();
    const selectionDispatch = useSelectionDispatch();
    useOnGlobalDomEvent(["keydown"], (event) => {
        // TODO: map modifier key combinations to cellstate types
        // eslint-disable-next-line no-nested-ternary
        const type = event.metaKey ? "center" : event.shiftKey ? "corner" : "value";
        if (event.code.startsWith("Digit")) {
            event.preventDefault();
            const value = getCellValue(Number(event.code.replace("Digit", "")));
            if (value === undefined) {
                return;
            }
            dispatch({
                type,
                value,
                selection,
            });
            return;
        }
        if (event.key === "Backspace") {
            event.preventDefault();
            dispatch({
                type,
                value: undefined,
                selection,
            });
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            selectionDispatch({ type: "reset" });
        }

        if (event.key === "a" && event.metaKey) {
            event.preventDefault();
            selectionDispatch({ type: "all", cells });
        }
    }, [selection, dispatch, JSON.stringify(cells)]);
};

export default useInput;
