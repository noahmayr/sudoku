import { createContext, PropsWithChildren, useMemo, useReducer } from "react";
import { AbstractCellValue, CellColor, CellInterface, CellValue } from "../components/Cell/useCells";
import useSafeContext from "../hooks/useSafeContext";
import { getKey, Selection } from "../hooks/useSelection";
import { merge } from "../util";

interface InputAction {
    type: 'value' | 'center' | 'corner' | 'color';
    value?: CellValue;
    selection: Selection
}

export type GivenDigits = Record<string, CellValue | undefined>;

interface InitAction {
    type: 'given';
    values: GivenDigits;
}

type ReducerAction = InputAction | InitAction;

type AnyCellValue = CellValue | AbstractCellValue;
type PencilMarks = Set<AnyCellValue>;

export interface CellState {
    given?: CellValue;
    value?: CellValue | AbstractCellValue;
    center?: PencilMarks;
    corner?: PencilMarks;
    color?: CellColor;
}

type InputDispatch = React.Dispatch<ReducerAction>
export type InputState = Record<string, CellState | undefined>;

const InputDispatchContext = createContext<InputDispatch | undefined>(undefined);
const InputStateContext = createContext<InputState | undefined>(undefined);

interface Change {
    key: string;
    state?: CellState;
}

const applyChange = (state: InputState, selection: Change[], callback: (change: CellState) => CellState) => {
    const changes = selection.map(({ key, state = {} }) => {
        return {
            [key]: callback(state)
        }
    });
    console.log(`applying ${changes.length} changes`);
    return changes.length > 0 ? merge(state, ...changes) : state;
}

function createFilter<K extends keyof CellState>(type: K, filterCallback: (state: CellState[K]) => unknown) {
    return ({ state = {} }: Change) => filterCallback(state[type]);
}

const reduceInputState = (oldState: InputState, action: ReducerAction): InputState => {
    if (action.type === 'given') {
        const initialCommit = Object.entries(action.values).map(([key, value]): InputState => {
            return {
                [key]: {
                    given: value
                }
            }
        })
        return merge(oldState, ...initialCommit);
    }

    const { type, value } = action;
    
    const selection: Change[] = Object.keys(action.selection).map(key => {
        return { key, state: oldState[key] }
    }).filter(cell => cell.state?.given === undefined || type === 'color');

    if (type === 'value' || type === 'color') {
        const hasAnyValue = createFilter(type, state => state !== undefined);
        const notHasValue = createFilter(type, state => state !== value);

        // delete value from all selected cells that are not empty
        if (value === undefined) {
            return applyChange(oldState, selection.filter(hasAnyValue), state => ({ ...state, [type]: value }))
        }

        const withoutValue = selection.filter(notHasValue);

        // some selected cells do not have the value, assign it to them
        if (withoutValue.length > 0) {
            return applyChange(oldState, withoutValue, state => ({ ...state, [type]: value }))
        }

        // all selected cells have the value, remove it from them
        return applyChange(oldState, selection, ({ [type]: _, ...old }) => old);
    }

    if (type === 'center' || type === 'corner') {

        // delete all marks of type from any cells that have any
        if (value === undefined) {
            const hasMarks = selection.filter(createFilter(type, state => state?.size));
            return applyChange(oldState, hasMarks, ({ [type]: old, ...state }) => {
                const marks = new Set<AnyCellValue>();
                return ({ ...state, [type]: marks })
            });
        }

        const withoutValue = selection.filter(createFilter(type, state => !state?.has(value)));

        // some selected cells do not have the mark, add it to them
        if (withoutValue.length > 0) {
            return applyChange(oldState, withoutValue, ({ [type]: old, ...state }) => {
                const marks = new Set<AnyCellValue>(old);
                marks.add(value);
                return ({ ...state, [type]: marks })
            });
        }

        // all selected cells have the mark, remove it from them
        return applyChange(oldState, selection, ({ [type]: old, ...state }) => {
            const marks = new Set<AnyCellValue>(old);
            marks.delete(value);
            return ({ ...state, [type]: marks })
        });
    }
    return oldState;
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
    const key = getKey(cell);
    const { [key]: state } = useInputState();
    return useMemo(() => {
        return state ?? {};
    }, [key, state]);
}
