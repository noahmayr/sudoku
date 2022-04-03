import {
    DependencyList,
    PropsWithChildren,
    createContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import { useSelector } from "react-redux";
import useSafeContext from "../hooks/useSafeContext";
import { PositionKey, Region } from "../state/slice/game";
import { CellState, selectCell } from "../state/slice/input";

interface ValidatorItem {
    key: PositionKey;
    state: CellState;
}

interface ValidatorProps {
    items: ValidatorItem[]
}

export interface ValidationResult {
    errors: Region;
    warnings: Region;
    filled?: boolean;
    errorMessage?: string;
    errorSource?: string;
}

export type Validator = (props: ValidatorProps) => ValidationResult;

type ValidationRef = React.MutableRefObject<ValidationResult>;

interface RegisterValidationAction {
    type: "add" | "remove";
    ref: ValidationRef;
}

interface UpdateValidationAction {
    type: "update";
    ref: ValidationRef;
    result: ValidationResult;
}

type ValidationReducerAction = RegisterValidationAction | UpdateValidationAction;

type ValidationDispatch = React.Dispatch<ValidationReducerAction>;
type ValidationState = ValidationRef[];

const ValidationDispatchContext = createContext<ValidationDispatch | undefined>(undefined);
const ValidationStateContext = createContext<ValidationState | undefined>(undefined);

const useValidationDispatch = () => useSafeContext(
    ValidationDispatchContext,
    "useValidationDispatch can only be used inside ValidationProvider",
);

const useValidationState = () => useSafeContext(
    ValidationStateContext,
    "useValidationState can only be used inside ValidationProvider",
);

const reduceValidatorList = (state: ValidationRef[], action: ValidationReducerAction) => {
    const { ref, type } = action;
    if (type === "update") {
        ref.current = action.result;
        return [...state];
    }
    if (type === "add") {
        return [...state, ref];
    }
    if (type === "remove") {
        return state.filter(item => item !== ref);
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

export const useValidator = (region: Region, validator: Validator, deps: DependencyList) => {
    const dispatch = useValidationDispatch();
    const selection = useSelector(selectCell.byRegion(region));

    const result: ValidationResult = useMemo(() => {
        const items = Array.from(selection, ([key, state]) => {
            return { key, state };
        });
        return validator({ items });
    }, [selection, ...deps]);

    const ref: ValidationRef = useRef<ValidationResult>(result);

    useEffect(() => {
        dispatch({
            type: "update",
            ref,
            result,
        });
    }, [result]);

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

export const useValidation = (): ValidationResult[] => {
    const state = useValidationState();
    // const input = useSelector(selectCell.all);
    return state.map(validatorRef => validatorRef.current);
};
