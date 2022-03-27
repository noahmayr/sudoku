import { CellState, InputState } from "../Input";

export type CellSelection = Record<string, true>;

export interface SelectionReducerAction {
    position?: Point;
    selected?: boolean;
    reset?: boolean;
}

export interface DraggingSelectionAction {
    type: "drag";
    position?: Point;
    intersect: boolean;
}

export interface AllWithSameValueSelectionAction {
    type: "samevalue";
    position: Point;
    valueType: keyof CellState;
    inputState: InputState;
    intersect: boolean;
}

export interface StopSelectionAction {
    type: "stop";
}

export interface ResetSelectionAction {
    type: "reset";
}

export type SelectionAction = DraggingSelectionAction | StopSelectionAction | ResetSelectionAction | AllWithSameValueSelectionAction;

export interface SelectionState {
    cells: CellSelection;
    selecting?: boolean;
}
