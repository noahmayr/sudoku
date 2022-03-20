import classes from './Cell.module.scss';
import { CellInterface } from './useCells';

interface CellProps {
    cell: CellInterface;
}

const Cell = ({ cell }: CellProps) => {
    const value = cell.given ?? cell.value;
    const isGiven = cell.given !== undefined;
    return (
        <svg x={cell.x} y={cell.y} width={1} height={1} className={classes.cell}>
            <rect x="0%" y="0%" width="100%" height="100%" className={classes.cellRect} />
            <text width="1" height="1" x="50%" y="50%" className={classes.cellValue}>
                {value}
            </text>
        </svg>
    )
}

export default Cell;