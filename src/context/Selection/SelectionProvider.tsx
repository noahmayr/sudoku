import { createContext, PropsWithChildren } from "react";
import { useImmerReducer } from "use-immer";
import useSafeContext from "../../hooks/useSafeContext";
import reduceSelection from "./reduceSelection";
import { SelectionAction, SelectionDispach, SelectionState } from "./types.d";

const SelectionDispatchContext = createContext<SelectionDispach | undefined>(undefined);
export const useSelectionDispatch = () => useSafeContext(
    SelectionDispatchContext,
    "useSelectionDispatch can only be used inside SelectionProvider",
);

const SelectionStateContext = createContext<SelectionState | undefined>(undefined);
export const useSelectionState = () => useSafeContext(
    SelectionStateContext,
    "useSelectionState can only be used inside SelectionProvider",
).cells;

const SelectionProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [state, dispatch] = useImmerReducer<SelectionState, SelectionAction>(
        reduceSelection,
        { cells: new Set() },
    );
    return (
        <SelectionDispatchContext.Provider value={dispatch}>
            <SelectionStateContext.Provider value={state}>
                {children}
            </SelectionStateContext.Provider>
        </SelectionDispatchContext.Provider>
    );
};

export default SelectionProvider;
