import { memo } from "react";
import { getKey } from "../../util";
import Cell from "./Cell";
import { CellIndex } from "./useCells";

interface CellsProps {
    cells: CellIndex;
}

const Cells = ({ cells }: CellsProps) => (
    <g id="cells">
        {Object.values(cells).map((cell) => (
            <Cell key={getKey(cell)} cell={cell}></Cell>
        ))}
    </g>
);

export default memo(Cells);
