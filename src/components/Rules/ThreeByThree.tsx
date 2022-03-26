import classes from './ThreeByThree.module.scss';
import { useMemo } from 'react';
import UniqueRegion from './UniqueRegion';
import { RegionCells } from '../Region/useRegionPath';
import { CellIndex } from '../Cell/useCells';
import { getKey } from '../../util';

interface ThreeByThreeProps {
    cells: CellIndex
}

const ThreeByThree = ({cells}: ThreeByThreeProps) => {
    const regions = useMemo(() => {
        const topLefts: Point[] = [0, 1, 2].map(y => {
            return [0, 1, 2].map(x => {
                return { x: x * 3, y: y * 3 };
            });
        }).flat(1);
        return topLefts.map(({ x, y }) => {
            const cells = [0, 1, 2].map(deltaY => {
                return [0, 1, 2].map(deltaX => {
                    return { x: x + deltaX, y: y + deltaY };
                });
            }).flat(1);
            const region: RegionCells = {};
            cells.forEach((cell) => region[getKey(cell)] = true);
            return region;
        });
    }, [])
    return (<>
        {regions.map((region, index) =>
            (<UniqueRegion key={index} className={classes.root} region={region} cells={cells} />)
        )}
    </>)
}

export default ThreeByThree;