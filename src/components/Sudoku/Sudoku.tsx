import classes from "./Sudoku.module.scss";
import useSelection from "../../hooks/useSelection";
import ThreeByThree from "../Rules/ThreeByThree";
import useCells from "../Cell/useCells";
import Validation from "../Validation/Validation";
import UniqueRows from "../Rules/UniqueRows";
import UniqueColumns from "../Rules/UniqueColumns";
import useInput from "../../hooks/useInput";
import useGame, { HARD_GAME } from "../../hooks/useGame";
import Grid from "./Grid";
import Cells from "../Cell/Cells";
import SelectionRegion from "../Selection/SelectionRegion";

const useSvgProps = (size: Size) => {
    const { ref } = useSelection();
    const { x, y, width, height } = {
        x: -0.25,
        y: -0.25,
        width: size.width + 0.5,
        height: size.height + 0.5,
    };
    return {
        ref,
        viewBox: `${x} ${y} ${width} ${height}`,
        style: {
            height: height * 80,
            fontSize: `${1 / 32}rem`,
        },
    };
};


const Sudoku = () => {
    const size = useGame(HARD_GAME);

    const svgProps = useSvgProps(size);
    const cells = useCells(size);
    useInput(cells);

    return (
        <svg
            id="svgrenderer"
            className={classes.svg}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            vectorEffect="nonScalingStroke"
            {...svgProps}
        >
            <g id="scale" >
                <Grid {...size}></Grid>
                <Cells></Cells>
                <g id="regions">
                    <ThreeByThree />
                    <UniqueRows />
                    <UniqueColumns />
                </g>
                <g id="errors">
                    <Validation />
                </g>
                <SelectionRegion />
            </g>
        </svg>
    );
};

export default Sudoku;
