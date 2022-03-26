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

const reduceInputState = (oldState: InputState, action: ReducerAction): InputState => {
    if (action.type === 'given') {
        const { values } = action;
        const initialCommit = Object.entries(values).map(([key, value]): InputState => {
            return {
                [key]: {
                    given: value
                }
            }
        })
        return merge(oldState, ...initialCommit);
    }

    const { type, value, selection } = action;
    const cells = Object.keys(selection).map(key => ({ key, state: oldState[key] }))
        .filter(cell => cell.state?.given === undefined || type === 'color');

    if (type === 'value' || type === 'color') {
        if (value !== undefined && !cells.every(({ state }) => state?.[type] === value)) {
            const changes = cells.map(({ key, state }): InputState => ({ [key]: { ...state, [type]: value } }));
            return merge(oldState, ...changes);
        }
        const changes = cells.map(({ key, state = {} }): InputState => {
            const { [type]: _, ...old } = state;
            return { [key]: { ...old } };
        });
        return merge(oldState, ...changes);
    }
    if (type === 'center' || type === 'corner') {
        if (value === undefined) {
            const changes = cells.map(({ key, state: { [type]: old, ...state } = {} }): InputState => {
                const marks = new Set<AnyCellValue>();
                return { [key]: { ...state, [type]: marks } };
            });
            return merge(oldState, ...changes);
        }
        if (!cells.every(({ state }) => state?.[type]?.has(value))) {
            const changes = cells.map(({ key, state: { [type]: old, ...state } = {} }): InputState => {
                const marks = new Set<AnyCellValue>(old);
                marks.add(value);
                return { [key]: { ...state, [type]: marks } };
            });
            return merge(oldState, ...changes);
        }
        const changes = cells.map(({ key, state: { [type]: old, ...state } = {} }): InputState => {
            const marks = new Set<AnyCellValue>(old);
            marks.delete(value);
            return { [key]: { ...state, [type]: marks } };
        });
        return merge(oldState, ...changes);
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
