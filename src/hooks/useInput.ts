import { CellValue } from "../components/Cell/useCells";
import { useInputDispatch } from "../context/Input";
import useOnGlobalDomEvent from "./useOnGlobalDomEvent";
import { Selection } from "./useSelection"

const CELL_VALUES: CellValue[] = [1,2,3,4,5,6,7,8,9];

function isCellValue(value: number): value is CellValue {
    return CELL_VALUES.includes(value as CellValue);
}

const getCellValue = (value: number): CellValue|undefined => {
    if (isCellValue(value)) {
        return value;
    }
    return undefined;
}

const useInput = (selection: Selection) => {
    const dispatch = useInputDispatch();
    useOnGlobalDomEvent(['keydown'], (event) => {
        const numKey = Number(event.key);
        if (!isNaN(numKey)) {
            const value = getCellValue(numKey);
            if (value === undefined) {
                return;
            }
            dispatch({
                type: 'value',
                value: value, 
                selection: selection
            });
        }
        if (event.key === 'Backspace') {
            dispatch({
                type: 'value',
                value: undefined, 
                selection: selection
            });
        }
        
        
    }, [selection]);
}

export default useInput;