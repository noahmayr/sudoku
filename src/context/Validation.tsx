/*
 * TODO: split this context in the future to make it more managable
 * and reduce the complexity of this file
 */
// eslint-disable-next-line object-curly-newline
import { createContext, DependencyList, PropsWithChildren, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { CellIndex, CellInterface } from "../components/Cell/useCells";
import { RegionCells } from "../components/Region/useRegionPath";
import useSafeContext from "../hooks/useSafeContext";
import { CellState, InputState, useInputState } from "./Input";

interface ValidatorItem {
    cell: CellInterface;
    state: CellState;
}

interface ValidatorProps {
    items: ValidatorItem[]
}

export interface ValidationResult {
    errorCells: CellIndex;
    filled?: boolean;
    errorMessage?: string;
    errorSource?: string;
}

export type Validator = (props: ValidatorProps) => ValidationResult;
type ValidatorCallback = (cells: CellIndex, input: InputState) => ValidationResult;

type ValidatorRef = React.MutableRefObject<ValidatorCallback>;

interface ValidatorReducerAction {
    type: "add" | "remove";
    ref: ValidatorRef;
}

type ValidationDispatch = React.Dispatch<ValidatorReducerAction>;
type ValidationState = ValidatorRef[];

const ValidationDispatchContext = createContext<ValidationDispatch | undefined>(undefined);
const ValidationStateContext = createContext<ValidationState | undefined>(undefined);

const useValidationDispatch = () => { return useSafeContext(ValidationDispatchContext, "useValidationDispatch can only be used inside ValidationProvider"); };

const useValidationState = () => { return useSafeContext(ValidationStateContext, "useValidationState can only be used inside ValidationProvider"); };

const reduceValidatorList = (state: ValidatorRef[], { type, ref }: ValidatorReducerAction) => {
    if (type === "add") {
        return [...state, ref];
    }
    if (type === "remove") {
        return state.filter(item => { return item !== ref; });
    }
    return state;
};

export const ValidationProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [state, dispatch] = useReducer(reduceValidatorList, []);
    return (
        <ValidationDispatchContext.Provider value={dispatch}>
            <ValidationStateContext.Provider value={state}>
                {children}
            </ValidationStateContext.Provider>
        </ValidationDispatchContext.Provider>
    );
};

export const useValidator = (region: RegionCells, validator: Validator, deps: DependencyList) => {
    const dispatch = useValidationDispatch();
    const callback: ValidatorCallback = useCallback((cellIndex, input) => {
        const items = Object.keys(region)
            .map((key): ValidatorItem => {
                return { cell: cellIndex[key], state: input[key] ?? {} };
            });
        return validator({ items });
    }, [region, ...deps]);

    const ref: ValidatorRef = useRef<ValidatorCallback>(callback);

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    useEffect(() => {
        dispatch({
            type: "add",
            ref,
        });
        return () => {
            dispatch({
                type: "remove",
                ref,
            });
        };
    }, []);
};

export const useValidation = (cells: CellIndex): ValidationResult[] => {
    const input = useInputState();
    const state = useValidationState();
    return useMemo(
        () => { return state.map(validatorRef => { return validatorRef.current(cells, input); }); },
        [input, state, JSON.stringify(cells)],
    );
};
