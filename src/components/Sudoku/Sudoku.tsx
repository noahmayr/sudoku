import Regions from "../Rules/Regions";
import useCells from "../Cell/useCells";
import Validation from "../Validation/Validation";
import Rows from "../Rules/Rows";
import Columns from "../Rules/Columns";
import useInput from "../../hooks/useInput";
import useGame, { EASY_GAME, HARD_GAME } from "../../hooks/useGame";
import Grid from "./Grid";
import Cells from "../Cell/Cells";
import SelectionRegion from "../Selection/SelectionRegion";
import Svg from "../SVG/Svg";
import { SAMURAI_SUDOKU } from "../../hooks/samuraiGame";
import ColoredRegions from "../Extras/ColoredRegions";
import classes from "./Sudoku.module.scss";


const Sudoku = () => {
    const size = useGame(SAMURAI_SUDOKU);
    const cells = useCells(size);
    useInput(cells);

    return (
        <Svg size={size} padding={1}>
            <rect x={0} y={0} {...size} className={classes.background} />
            <ColoredRegions />
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
        </Svg>
    );
};

export default Sudoku;
