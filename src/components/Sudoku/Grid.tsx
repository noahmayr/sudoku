import LinePath, { Line } from "../SVG/LinePath";
import classes from "./Grid.module.scss";

const useGrid = ({ width, height }: Size): Line[] => {
    return [
        ...Array.from({ length: width + 1 }, (_, x): Line => {
            return {
                start: { x, y: 0 },
                vector: { x: 0, y: height }
            };
        }),
        ...Array.from({ length: height + 1 }, (_, y) => {
            return {
                start: { x: 0, y },
                vector: { x: width, y: 0 }
            };
        })
    ];
}

const Grid = (size: Size) => {
    const lines = useGrid(size)
    return (
        <g id="grid">
            <LinePath lines={lines} className={classes.cellGrid} />
        </g>
    )
}

export default Grid;