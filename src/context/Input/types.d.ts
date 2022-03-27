import { CellSelection } from "../../hooks/useSelection";

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type AbstractCellValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
export type CellColor = unknown;

export type AnyCellValue = CellValue | AbstractCellValue;
export type PencilMarks = Set<AnyCellValue>;

export interface CellState {
    given?: CellValue;
    value?: AnyCellValue;
    center?: PencilMarks;
    corner?: PencilMarks;
    color?: CellColor;
}

export type GivenDigits = Record<string, CellValue | undefined>;

export interface InitAction {
    type: "given";
    values: GivenDigits;
}

interface AbstractInputAction {
    value?: CellValue;
    selection: CellSelection
}

export interface InputValueAction extends AbstractInputAction {
    type: "value";
}

export interface InputCenterAction extends AbstractInputAction {
    type: "center";
}

export interface InputCornerAction extends AbstractInputAction {
    type: "corner";
}

export interface InputColorAction extends AbstractInputAction {
    type: "color";
}

export type InputMarkAction = InputCenterAction | InputCornerAction;

export type InputAction = InitAction | InputValueAction | InputMarkAction | InputColorAction;

export type InputDispatch = React.Dispatch<InputAction>
export type InputState = Record<string, CellState | undefined>;
