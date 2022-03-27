import { createContext, PropsWithChildren, useEffect, useReducer } from "react";
import useSafeContext from "../hooks/useSafeContext";
import { getKey } from "../util";

export type CellSelection = Record<string, true>;

interface SelectionReducerAction {
    position?: Point;
    selected?: boolean;
    reset?: boolean;
}

interface DraggingSelectionAction {
    type: 'drag';
    position?: Point;
    intersect: boolean;
}

interface StopSelectionAction {
    type: 'stop';
}

interface ResetSelectionAction {
    type: 'reset';
}

type SelectionAction = DraggingSelectionAction | StopSelectionAction | ResetSelectionAction;


type SelectionDispatch = React.Dispatch<SelectionAction>;

interface SelectionState {
    cells: CellSelection;
    selecting?: boolean;
}

const SelectionDispatchContext = createContext<SelectionDispatch | undefined>(undefined);
const SelectionStateContext = createContext<SelectionState | undefined>(undefined);


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

const selectionReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
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

export const SelectionProvider = ({ children }: PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(selectionReducer, { cells: {} });
    return (
        <SelectionDispatchContext.Provider value={dispatch}>
            <SelectionStateContext.Provider value={state}>
                {children}
            </SelectionStateContext.Provider>
        </SelectionDispatchContext.Provider>
    );
}


export const useSelectionDispatch = () => {
    return useSafeContext(SelectionDispatchContext, 'useSelectionDispatch can only be used inside SelectionProvider');
}

export const useSelectionState = () => {
    return useSafeContext(SelectionStateContext, 'useSelectionState can only be used inside SelectionProvider').cells;
}

interface UseDraggingSelectionProps {
    shouldSelect: boolean;
    position?: Point;
    intersect: boolean;
}

export const useDraggingSelection = ({ shouldSelect, position, intersect }: UseDraggingSelectionProps) => {
    const dispatch = useSelectionDispatch();

    useEffect(() => {
        if (!shouldSelect) {
            return dispatch({ type: 'stop' });
        }
        dispatch({ type: 'drag', position, intersect });
    }, [shouldSelect, JSON.stringify(position), dispatch, intersect]);
}