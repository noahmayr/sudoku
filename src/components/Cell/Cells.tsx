import { memo } from "react";
import { useSelector } from "react-redux";
import { selectGame } from "../../state/slice/game";
import { RootState } from "../../state/store";
import Cell from "./Cell";

const Cells = () => {
    const cells = useSelector(selectGame.grid);
    return (
        <g id="cells">
            {Array.from(cells).map(([key, cell]) => (
                <Cell key={key} cell={cell}></Cell>
            ))}
        </g>
    );
};

export default memo(Cells);
