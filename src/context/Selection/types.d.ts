import React from "react";
import { CellIndex } from "../../components/Cell/useCells";
import { Region } from "../../state/slice/game";
import { CellState, InputState } from "../../state/slice/input";

export type CellSelection = Record<string, true>;

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

export interface SelectAllAction {
    type: "all";
    cells: CellIndex;
}

export interface StopSelectionAction {
    type: "stop";
}

export interface ResetSelectionAction {
    type: "reset";
}

export type SelectionAction = DraggingSelectionAction
    | StopSelectionAction
    | ResetSelectionAction
    | AllWithSameValueSelectionAction
    | SelectAllAction;

export type SelectionDispach = React.Dispatch<SelectionAction>;

export interface SelectionState {
    cells: Region;
    selecting?: boolean;
}
