import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Cell from "./Cell";

const Cells = () => {
    const cells = useSelector((state: RootState) => state.game?.grid);
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
