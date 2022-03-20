import { createContext, DependencyList, PropsWithChildren, Ref, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { CellIndex } from "../components/Cell/useCells";

export type Validator = (cells: CellIndex) => ValidationResult;

export interface ValidationResult {
    errorCells: CellIndex;
    errorMessage?: string;
    errorSource?: string;
}

type ValidatorRef = React.MutableRefObject<Validator>

interface ValidatorReducerAction {
    type: 'add' | 'remove';
    validator: ValidatorRef;
}

interface ValidationContextProps {
    state: ValidatorRef[];
    dispatch: React.Dispatch<ValidatorReducerAction>;
}

const ValidationContext = createContext<ValidationContextProps | undefined>(undefined);

const useValidationContext = () => {
    const context = useContext(ValidationContext);
    if (context === undefined) {
        throw Error('useValidationContext can only be used inside ValidationProvider');
    }
    return context;
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
        <ValidationContext.Provider value={{ state, dispatch }}>
            {children}
        </ValidationContext.Provider>
    )
}

export const useValidator = (validator: Validator, deps: DependencyList): void => {
    const { dispatch } = useValidationContext();
    const callback = useCallback(validator, deps) 
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
    const { state } = useValidationContext();
    return state.map(validatorRef => validatorRef.current(cells))
}