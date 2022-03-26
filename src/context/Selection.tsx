import { createContext, PropsWithChildren, useEffect, useReducer, useState } from "react";
import useSafeContext from "../hooks/useSafeContext";
import { getKey } from "../util";

export type CellSelection = Record<string, true>;

interface SelectionReducerAction {
    position?: Point;
    selected?: boolean;
    reset?: boolean;
}

type SelectionDispatch = React.Dispatch<SelectionReducerAction>;
type SelectionState = CellSelection;

const SelectionDispatchContext = createContext<SelectionDispatch | undefined>(undefined);
const SelectionStateContext = createContext<SelectionState | undefined>(undefined);

const selectionReducer = (state: CellSelection, { position, selected = true, reset = false }: SelectionReducerAction): CellSelection => {
    if (position === undefined) {
        return reset ? {} : state;
    }
    if (reset) {
        if (!selected) {
            return {};
        }
        return {
            [getKey(position)]: selected
        };
    }
    if (!selected) {
        delete state[getKey(position)];
        return state;
    }
    return {
        ...state,
        [getKey(position)]: selected
    };
}

export const SelectionProvider = ({ children }: PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(selectionReducer, {});
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
    return useSafeContext(SelectionStateContext, 'useSelectionState can only be used inside SelectionProvider');
}

interface UseDraggingSelectionProps {
    shouldSelect: boolean;
    position?: Point;
    intersect: boolean;
}

export const useDraggingSelection = ({ shouldSelect, position, intersect }: UseDraggingSelectionProps) => {
    const [selecting, setSelecting] = useState<boolean | null>(null);
    const state = useSelectionState();
    const dispatch = useSelectionDispatch();

    useEffect(() => {
        
        if (!shouldSelect) {
            return setSelecting(null);
        }

        if (position === undefined && !selecting) {
            dispatch({ reset: true });
        }

        if (position !== undefined) {
            const positionIsSelected = state[getKey(position)];

            if (selecting === null) {
                setSelecting(intersect ? !positionIsSelected : true);
                return dispatch({ position, selected: intersect ? !positionIsSelected : true, reset: !intersect });
            }

            if (selecting === positionIsSelected) {
                return;
            }

            return dispatch({ position, selected: selecting });
        }

    }, [shouldSelect, position, selecting, setSelecting, JSON.stringify(state), dispatch]);
}