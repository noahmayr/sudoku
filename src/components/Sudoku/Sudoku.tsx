import classes from './Grid.module.scss';
import useSelection, { getKey } from '../../hooks/useSelection';
import Cell from '../Cell/Cell';
import LinePath, { Line } from '../SVG/LinePath';
import Region from '../Region/Region';
import ThreeByThree from '../Rules/ThreeByThree';
import useCells, { CellInterface, CellValue } from '../Cell/useCells';
import GridErrors from '../Error/GridErrors';
import UniqueRows from '../Rules/UniqueRows';
import UniqueColumns from '../Rules/UniqueColumns';
import useInput from '../../hooks/useInput';
import useGame, { EXAMPLE } from '../../hooks/useGame';
import Grid from './Grid';
import Cells from '../Cell/Cells';

const useGridDimensions = ({ width, height }: Size) => {
    return {
        bounds: {
            x: - 0.25,
            y: - 0.25,
            width: width + 0.5,
            height: width + 0.5,
        } as Bounds,
        size: {
            width,
            height,
        } as Size
    }
}

const useSvgProps = ({ width, height }: Size) => {
    return {
        bounds: {
            x: - 0.25,
            y: - 0.25,
            width: width + 0.5,
            height: width + 0.5,
        } as Bounds,
        size: {
            width,
            height,
        } as Size
    }
}

const useGrid = ({ width = 9, height = 9 }: GridProps) => {
    const dimensions = useGridDimensions({ width, height });
    const { ref, selection } = useSelection()
    useInput(selection);

    return {
        dimensions,
        selection,
        ref
    };
}

const Sudoku = (props: GridProps) => {
    const {width, height } = useGame(EXAMPLE);
    const {
        ref,
        selection,
        dimensions: { bounds, size}
    } = useGrid({width, height});
    const cells = useCells(size);

    return (
        <svg
            id="svgrenderer"
            className={classes.svg}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            vectorEffect="nonScalingStroke"
            style={{width: bounds.width * 80, height: bounds.height * 80, fontSize: `${1 / 32}rem`}}
            viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
            ref={ref}
        >
            <g id="scale" >
                <Grid {...size}></Grid>
                <Cells cells={cells}></Cells>
                <g id="regions">
                    <ThreeByThree cells={cells} />
                    <UniqueRows cells={cells} />
                    <UniqueColumns cells={cells} />
                </g>
                <g id="errors">
                    <GridErrors cells={cells} />
                </g>
                <g id="selection">
                    <Region className={classes.selection} region={selection} />
                </g>
            </g>
        </svg>
    );
}

export default Sudoku;
