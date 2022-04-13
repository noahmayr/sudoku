import { memo } from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../state/slice/game";
import Cell from "./Cell";

const Cells = () => {
    const cells = useSelector(selectGame.grid);
    if (cells === undefined) {
        return null;
    }

    return (
        <g id="cells">
            {Array.from(cells).map(([key, cell]) => (
                <Cell key={key} cell={cell}></Cell>
            ))}
        </g>
    );
};

export default memo(Cells);
