import { createContext, PropsWithChildren, useReducer } from "react";
import { AbstractCellValue, CellColor, CellInterface, CellValue } from "../components/Cell/useCells";
import useSafeContext from "../hooks/useSafeContext";
import { getKey, Selection } from "../hooks/useSelection";

interface InputStateReducerAction {
    type: 'value' | 'center' | 'corner' | 'color';
    value?: CellValue;
    selection: Selection
}

type AnyCellValue = CellValue | AbstractCellValue;
type PencilMarks = Set<AnyCellValue>;

interface CellState {
    given?: CellValue;
    value?: CellValue | AbstractCellValue;
    center?: PencilMarks;
    corner?: PencilMarks;
    color?: CellColor;
}

type InputDispatch = React.Dispatch<InputStateReducerAction>
type InputState = Record<string, CellState|undefined>;

const InputDispatchContext = createContext<InputDispatch | undefined>(undefined);
const InputStateContext = createContext<InputState | undefined>(undefined);

const reduceInputState = (state: InputState, { type, value, selection }: InputStateReducerAction): InputState => {
    const keys = Object.keys(selection);
    if (type === 'value' || type === 'color') {
        if (value !== undefined && keys.some(key => state[key]?.[type] !== value)) {
            const changes = keys.map((key): InputState => ({ [key]: { ...state[key], [type]: value } }));
            return {
                ...state,
                ...changes.reduce((a, b) => ({ ...a, ...b }), {})
            };
        }
        const changes = keys.map((key): InputState => {
            const {[type]: _, ...old} = state[key] ?? {};
            return { [key]: { ...old } };
        });
        return {
            ...state,
            ...changes.reduce((a, b) => ({ ...a, ...b }), {})
        };
    }
    if (type === 'center' || type === 'corner') {
        if (value === undefined) {
            const changes = keys.map((key): InputState => {
                const {[type]: marks, ...old} = state[key] ?? {};
                marks?.clear();
                return { [key]: { ...old, [type]: marks } };
            });
            return {
                ...state,
                ...changes.reduce((a, b) => ({ ...a, ...b }), {})
            };
        }
        if (keys.some(key => !state[key]?.[type]?.has(value))) {
            const changes = keys.map((key): InputState => {
                const {[type]: marks = new Set<AnyCellValue>(), ...old} = state[key] ?? {};
                marks.add(value);
                return { [key]: { ...old, [type]: marks } };
            });
            return {
                ...state,
                ...changes.reduce((a, b) => ({ ...a, ...b }), {})
            };
        }
        const changes = keys.map((key): InputState => {
            const {[type]: marks, ...old} = state[key] ?? {};
            marks?.delete(value);
            return { [key]: { ...old, [type]: marks } };
        });
        return {
            ...state,
            ...changes.reduce((a, b) => ({ ...a, ...b }), {})
        };
    }
    return state;
}

export const InputProvider = ({ children }: PropsWithChildren<any>) => {
    const [state, dispatch] = useReducer(reduceInputState, {});
    return (
        <InputDispatchContext.Provider value={dispatch}>
            <InputStateContext.Provider value={state}>
                {children}
            </InputStateContext.Provider>
        </InputDispatchContext.Provider>
    );
}

export const useInputDispatch = () => {
    return useSafeContext(InputDispatchContext, 'useInputDispatch can only be used inside InputProvider');
}

export const useInputState = () => {
    return useSafeContext(InputStateContext, 'useInputState can only be used inside InputProvider');
}

export const useCellState = (cell: CellInterface): CellState => {
    const {[getKey(cell)]: state} = useInputState();
    return state ?? {};
}