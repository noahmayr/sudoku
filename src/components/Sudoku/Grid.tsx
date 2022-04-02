import { range } from "../../util";
import LinePath, { Line } from "../SVG/LinePath";
import classes from "./Grid.module.scss";

const useGrid = ({ width, height }: Size): Line[] => [
    ...range(width + 1).map((x): Line => {
        return {
            start: { x, y: 0 },
            vector: { x: 0, y: height },
        };
    }),
    ...range(height + 1).map((y) => {
        return {
            start: { x: 0, y },
            vector: { x: width, y: 0 },
        };
    }),
];

const Grid = (size: Size) => {
    const lines = useGrid(size);
    return (
        <g id="grid">
            <LinePath lines={lines} className={classes.cellGrid} />
        </g>
    );
};

export default Grid;
