import { createContext, PropsWithChildren, useMemo, useReducer } from "react";
import { CellInterface } from "../../components/Cell/useCells";
import useSafeContext from "../../hooks/useSafeContext";
import { getKey } from "../../util";
import reduceInputState from "./reduceInputState";
import { CellState, InputDispatch, InputState } from "./types.d";


const InputDispatchContext = createContext<InputDispatch | undefined>(undefined);
const InputStateContext = createContext<InputState | undefined>(undefined);

export const InputProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [state, dispatch] = useReducer(reduceInputState, {});
    return (
        <InputDispatchContext.Provider value={dispatch}>
            <InputStateContext.Provider value={state}>
                {children}
            </InputStateContext.Provider>
        </InputDispatchContext.Provider>
    );
};

export const useInputDispatch = () => {
    return useSafeContext(InputDispatchContext, "useInputDispatch can only be used inside InputProvider");
};

export const useInputState = () => {
    return useSafeContext(InputStateContext, "useInputState can only be used inside InputProvider");
};

export const useCellState = (cell: CellInterface): CellState => {
    const key = getKey(cell);
    const { [key]: state } = useInputState();
    return useMemo(() => {
        return state ?? {};
    }, [state]);
};
