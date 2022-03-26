import { memo } from "react";
import { getKey } from "../../util";
import Cell from "./Cell"
import { CellIndex } from "./useCells"

interface CellsProps {
    cells: CellIndex;
}

const Cells = memo(({cells}: CellsProps) => {
    return (
        <g id="cells">
            {Object.values(cells).map((cell) => {
                return (
                    <Cell key={getKey(cell)} cell={cell}></Cell>
                )
            })}
        </g>
    )
});

export default Cells;