import { useDispatch } from "react-redux";
import { CellIndex } from "../components/Cell/useCells";
import { useSelectionDispatch, useSelectionState } from "../context/Selection";
import { CellValue, input } from "../state/slice/input";
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
    const selection = useSelectionState();

    const selectionDispatch = useSelectionDispatch();
    const dispatch = useDispatch();
    useOnGlobalDomEvent(["keydown"], (event) => {
        const meta = event.metaKey || event.ctrlKey;
        // TODO: map modifier key combinations to cellstate types
        // eslint-disable-next-line no-nested-ternary
        const type = meta ? "center" : event.shiftKey ? "corner" : "value";
        if (event.code.startsWith("Digit")) {
            event.preventDefault();
            const value = getCellValue(Number(event.code.replace("Digit", "")));
            if (value === undefined) {
                return;
            }
            dispatch(input.value({
                type,
                region: selection,
                value,
            }));
            return;
        }
        if (event.key === "Backspace") {
            event.preventDefault();
            dispatch(input.delete({
                type,
                region: selection,
            }));
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            selectionDispatch({ type: "reset" });
        }

        if (event.key === "a" && meta) {
            event.preventDefault();
            selectionDispatch({ type: "all", cells });
        }
    }, [selection, dispatch, JSON.stringify(cells)]);
};

export default useInput;
