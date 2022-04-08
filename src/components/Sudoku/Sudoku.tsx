import Regions from "../Rules/Regions";
import useCells from "../Cell/useCells";
import Validation from "../Validation/Validation";
import Rows from "../Rules/Rows";
import Columns from "../Rules/Columns";
import useInput from "../../hooks/useInput";
import useGame, { HARD_GAME } from "../../hooks/useGame";
import Grid from "./Grid";
import Cells from "../Cell/Cells";
import SelectionRegion from "../Selection/SelectionRegion";
import Svg from "../SVG/Svg";

const Sudoku = () => {
    const size = useGame(HARD_GAME);
    const cells = useCells(size);
    useInput(cells);

    return (
        <Svg size={size} padding={1}>
            <g id="scale" >
                <rect x={0} y={0} {...size} fill={"#282c34"} />
                <Grid {...size}></Grid>
                <Cells></Cells>
                <g id="rules">
                    <Regions />
                    <Rows />
                    <Columns />
                </g>
                <g id="errors">
                    <Validation />
                </g>
                <SelectionRegion />
            </g>
        </Svg>
    );
};

export default Sudoku;
