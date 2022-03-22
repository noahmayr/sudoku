import { createContext, DependencyList, PropsWithChildren, useCallback, useEffect, useReducer, useRef } from "react";
import { CellIndex } from "../components/Cell/useCells";
import useSafeContext from "../hooks/useSafeContext";

export type Validator = (cells: CellIndex) => ValidationResult;

export interface ValidationResult {
    errorCells: CellIndex;
    errorMessage?: string;
    errorSource?: string;
}

type ValidatorRef = React.MutableRefObject<Validator>;

interface ValidatorReducerAction {
    type: 'add' | 'remove';
    validator: ValidatorRef;
}

type ValidationDispatch = React.Dispatch<ValidatorReducerAction>;
type ValidationState = ValidatorRef[];

const ValidationDispatchContext = createContext<ValidationDispatch | undefined>(undefined);
const ValidationStateContext = createContext<ValidationState | undefined>(undefined);

const useValidationDispatch = () => {
    return useSafeContext(ValidationDispatchContext, 'useValidationDispatch can only be used inside ValidationProvider');
}

const useValidationState = () => {
    return useSafeContext(ValidationStateContext, 'useValidationState can only be used inside ValidationProvider');
}

const reduceValidatorList = (state: ValidatorRef[], { type, validator }: ValidatorReducerAction): ValidatorRef[] => {
    if (type === 'add') {
        return [...state, validator];
    }
    if (type === 'remove') {
        return state.filter(ref => ref !== validator);
    }
    return state;
}

export const ValidationProvider = ({ children }: PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(reduceValidatorList, []);
    return (
        <ValidationDispatchContext.Provider value={dispatch}>
            <ValidationStateContext.Provider value={state}>
                {children}
            </ValidationStateContext.Provider>
        </ValidationDispatchContext.Provider>
    );
}

export const useValidator = (validator: Validator, deps: DependencyList): void => {
    const dispatch = useValidationDispatch();
    const callback = useCallback(validator, deps);
    const ref: ValidatorRef = useRef<Validator>(validator);

    useEffect(() => {
        ref.current = callback;
    }, [callback])

    useEffect(() => {
        dispatch({
            type: 'add',
            validator: ref
        });
        return () => {
            dispatch({
                type: 'remove',
                validator: ref
            });
        }
    },[])
}

export const useValidation = (cells: CellIndex): ValidationResult[] => {
    const state = useValidationState();
    return state.map(validatorRef => validatorRef.current(cells));
}