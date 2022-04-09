import { useSelector } from "react-redux";
import { CellColors, selectCell } from "../../state/slice/input";
import classes from "./Cell.module.scss";
import { CellInterface } from "./useCells";

interface CellProps {
    cell: CellInterface;
}

const cornerPositions: Point[] = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
];

const Cell = ({ cell }: CellProps) => {
    const state = useSelector(selectCell.byPosition(cell));
    if (state === undefined) {
        return null;
    }
    const {
        isGiven, value, center, corner, color: colors,
    } = state;
    const colorWidth = 100 / colors.size;
    return (
        <svg x={cell.x - 1} y={cell.y - 1} width={1} height={1} className={classes.cell}>
            <rect x="0%" y="0%" width="100%" height="100%" className={classes.cellRect} />
            {
                Array.from(colors).sort().map((color, index) => (
                    <rect
                        key={color}
                        x={`${colorWidth * index}%`}
                        width={`${colorWidth}%`}
                        fill={CellColors[color]}
                        y="0%"
                        height="100%"
                        className={classes.color}
                    />
                ))
            }
            {
                (value === undefined) ? (
                    <text width="1" height="1" x="50%" y="50%" className={classes.centerMark} data-count={center.size}>
                        {Array.from(center.values()).sort()}
                    </text>
                ) : null
            }
            <g data-mark="corner">
                {
                    (value === undefined) ? (
                        Array.from(corner.values()).sort().map((mark, idx) => {
                            const pos = cornerPositions[idx];
                            const x = (pos.x) * 33 + 50;
                            const y = (pos.y) * 33 + 50;
                            return (
                                <text key={idx} width="1" height="1" x={`${x}%`} y={`${y}%`} className={classes.cornerMark}>{mark}</text>
                            );
                        })
                    ) : null
                }
            </g>

            <text width="1" height="1" x="50%" y="50%" className={isGiven ? classes.given : classes.cellValue}>
                {value}
            </text>
        </svg>
    );
};

export default Cell;
