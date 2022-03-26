import { CellSelection } from "../../hooks/useSelection";
import { CellValue, AbstractCellValue } from "../../components/Cell/useCells";


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
    type: 'given';
    values: GivenDigits;
}

interface AbstractInputAction {
    value?: CellValue;
    selection: CellSelection
}

export interface InputValueAction extends AbstractInputAction {
    type: 'value';
}

export interface InputCenterAction extends AbstractInputAction {
    type: 'center';
}

export interface InputCornerAction extends AbstractInputAction {
    type: 'corner';
}

export interface InputColorAction extends AbstractInputAction {
    type: 'color';
}

export type InputAction = InitAction | InputValueAction | InputCenterAction | InputCornerAction | InputColorAction;

export type InputDispatch = React.Dispatch<InputAction>
export type InputState = Record<string, CellState | undefined>;
