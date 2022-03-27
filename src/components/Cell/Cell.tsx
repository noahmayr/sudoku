import { useMemo } from 'react';
import { useCellState } from '../../context/Input';
import classes from './Cell.module.scss';
import { CellInterface } from './useCells';

interface CellProps {
    cell: CellInterface;
}

const cornerPositions: Point[] = [
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 1},
    {x: 1, y: 1},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: 0},
]

const Cell = ({ cell }: CellProps) => {
    const state = useCellState(cell);
    return useMemo(() => {
        const value = state.given ?? state.value;
        const isGiven = state.given !== undefined;
        return (
            <svg x={cell.x} y={cell.y} width={1} height={1} className={classes.cell}>
                <rect x="0%" y="0%" width="100%" height="100%" className={classes.cellRect} />
                {
                    (value === undefined && state.center !== undefined) ? (
                        <text width="1" height="1" x="50%" y="50%" className={classes.centerMark} data-count={state.center.size}>
                            {Array.from(state.center?.values()).sort()}
                        </text>
                    ) : null
                }
                <g data-mark="corner">
                    {
                        (value === undefined && state.corner !== undefined) ? (
                            Array.from(state.corner?.values()).sort().map((mark, idx) => {
                                const pos = cornerPositions[idx];
                                const x = (pos.x) * 33 + 50;
                                const y = (pos.y) * 33 + 50;
                                return (
                                    <text key={idx} width="1" height="1" x={`${x}%`} y={`${y}%`} className={classes.cornerMark}>{mark}</text>
                                )
                            })
                        ) : null
                    }
                </g>
                
                <text width="1" height="1" x="50%" y="50%" className={isGiven ? classes.given : classes.cellValue}>
                    {value}
                </text>
            </svg>
        )
    }, [cell.x, cell.y, state]);
}

export default Cell;
