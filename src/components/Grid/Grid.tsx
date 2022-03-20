import { MouseEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import classes from './Grid.module.scss';
import useSelection, { getKey } from '../../hooks/useSelection';
import Cell from '../Cell/Cell';
import LinePath, { Line } from '../SVG/LinePath';
import Region from '../Region/Region';
import ThreeByThree from '../Region/ThreeByThree';

const createLine = (start: Point, vector: Vector) => {
    return {
        start,
        end: {
            x: start.x + vector.x,
            y: start.y + vector.y
        }
    }
}

const useGridDimensions = ({ width, height }: DimensionProps): { lines: Line[], bounds: Bounds, size: Size } => {
    const lines: Line[] = [];
    lines.push(...Array.from({ length: width + 1 }, (_, x): Line => {
        return createLine({ x: x, y: 0 }, { x: 0, y: height })
    }));
    lines.push(...Array.from({ length: height + 1 }, (_, y): Line => {
        return createLine({ x: 0, y: y }, { x: width, y: 0 })
    }));
    return {
        lines: lines,
        bounds: {
            x: - 0.25,
            y: - 0.25,
            width: width + 0.5,
            height: width + 0.5,
        },
        size: {
            width,
            height,
        }
    }
}

interface DimensionProps {
    width: number;
    height: number;
}

const useCells = ({ width, height }: DimensionProps) => {

    return useMemo(() => Array.from({ length: width }, (_, x): CellInterface[] => {
        return Array.from({ length: height }, (_, y): CellInterface => {
            return {
                x: x,
                y: y,
                //@ts-ignore
                given: Math.ceil((Math.random() * 9))
            }
        });
    }).flat(1), [width, height]);
}

const useGrid = ({ width = 9, height = 9}: GridProps) => {
    const dimensions = useGridDimensions({ width, height });
    const { cells, ref, selection } = useSelection({ dimensions, cells: useCells({ width, height }) })
    return {
        dimensions,
        cells,
        selection,
        ref
    };
}

const Grid = (props: GridProps) => {
    const {
        cells,
        ref,
        selection,
        dimensions: { bounds, lines, size }
    } = useGrid(props);

    return (
        <svg
            id="svgrenderer"
            className="boardsvg"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            style={{ vectorEffect: "non-scaling-stroke", width: bounds.width*64, height: bounds.height*64, fontSize: `${1/32}rem`, strokeWidth: '0.05em' }}
            viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
            ref={ref}
        >
            <g id="scale" >
                <g id="background">
                    <LinePath lines={lines} className={classes.cellGrid}/>
                </g>
                <g id="cells">
                    {cells.map((cell: CellInterface) => {
                        return (
                            <Cell key={getKey(cell)} cell={cell}></Cell>
                        )
                    })}
                </g>
                <g id="3x3-regions">
                    <ThreeByThree/>
                </g>
                <g id="selection">
                    <Region className={classes.selection} region={selection}/>
                </g>
            </g>
        </svg>
    );
}

export default Grid;
