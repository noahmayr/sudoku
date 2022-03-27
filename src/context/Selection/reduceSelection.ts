import { getKey } from "../../util";
import { CellSelection, SelectionState, SelectionAction } from "./types";

interface SelectCellProps {
    cells: CellSelection;
    key?: string;
    selecting: boolean;
}

const selectCell = ({ cells, key, selecting }: SelectCellProps): CellSelection => {
    if (key === undefined || !!cells[key] === selecting) {
        return cells;
    }
    if (selecting) {
        return { ...cells, [key]: true };
    }
    const { [key]: _, ...filteredCells } = cells;
    return filteredCells;
}

const reduceSelection = (state: SelectionState, action: SelectionAction): SelectionState => {
    if (action.type === 'reset') {
        return { cells: {} };
    }
    if (action.type === 'stop') {
        if (state.selecting === undefined) {
            return state;
        }
        return { cells: state.cells };
    }
    if (action.type === 'drag') {
        const { position, intersect } = action;
        const key = position !== undefined ? getKey(position) : undefined;
        const isSelected = key !== undefined ? !!state.cells[key] : undefined;
        const selecting = state.selecting ?? !(intersect && isSelected);

        if (state.selecting === undefined) {
            const cells = selectCell({key, selecting, cells: intersect ? state.cells : {}});
            return { cells, selecting };
        }

        const cells = selectCell({key, selecting, cells: state.cells});

        if (cells === state.cells && selecting === state.selecting) {
            return state;
        }

        return {selecting, cells};
    }
    return state;
}

export default reduceSelection;