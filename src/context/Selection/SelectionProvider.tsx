import { createContext, PropsWithChildren, useReducer } from "react";
import useSafeContext from "../../hooks/useSafeContext";
import reduceSelection from "./reduceSelection";
import { SelectionDispach, SelectionState } from "./types.d";

const SelectionDispatchContext = createContext<SelectionDispach | undefined>(undefined);
export const useSelectionDispatch = () => { return useSafeContext(SelectionDispatchContext, "useSelectionDispatch can only be used inside SelectionProvider"); };

const SelectionStateContext = createContext<SelectionState | undefined>(undefined);
export const useSelectionState = () => { return useSafeContext(SelectionStateContext, "useSelectionState can only be used inside SelectionProvider").cells; };

const SelectionProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [state, dispatch] = useReducer(reduceSelection, { cells: {} });
    return (
        <SelectionDispatchContext.Provider value={dispatch}>
            <SelectionStateContext.Provider value={state}>
                {children}
            </SelectionStateContext.Provider>
        </SelectionDispatchContext.Provider>
    );
};

export default SelectionProvider;
