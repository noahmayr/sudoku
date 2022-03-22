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
        const type = event.metaKey ? 'center' : 'value'
        if (event.code.startsWith('Digit')) {
            event.preventDefault();
            const value = getCellValue(Number(event.code.replace('Digit', '')));
            if (value === undefined) {
                return;
            }
            dispatch({
                type: type,
                value: value, 
                selection: selection
            });
        }
        const numKey = Number(event.code);
        if (event.key === 'Backspace') {
            dispatch({
                type: type,
                value: undefined, 
                selection: selection
            });
        }
        
        
    }, [selection]);
}

export default useInput;