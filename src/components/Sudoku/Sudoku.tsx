import { memo } from "react";
import Regions from "../Rules/Regions";
import Validation from "../Validation/Validation";
import Rows from "../Rules/Rows";
import Columns from "../Rules/Columns";
import Grid from "./Grid";
import Cells from "../Cell/Cells";
import SelectionRegion from "../Selection/SelectionRegion";
import Svg from "../SVG/Svg";
import ColoredRegions from "../Extras/ColoredRegions";
import classes from "./Sudoku.module.scss";
import { selectGame } from "../../state/slice/game";
import { useAppSelector } from "../../state/store";


const Sudoku = () => {
    const size = useAppSelector(selectGame.dimensions);
    if (size === undefined) {
        return null;
    }

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

export default memo(Sudoku);
