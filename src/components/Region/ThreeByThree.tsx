import classes from './ThreeByThree.module.scss';
import Region, { RegionCells } from './Region';
import { getKey } from '../../hooks/useSelection';
import { useMemo } from 'react';

interface ThreeByThreeProps {
}

const ThreeByThree = () => {
    const regions = useMemo(() => {
        const topLefts: Point[] = [0, 1, 2].map(y => {
            return [0, 1, 2].map(x => {
                return { x: x * 3, y: y * 3 };
            });
        }).flat(1);
        console.log(topLefts);
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
        (<Region key={index} className={classes.root} region={region} />)
    )}
    </>)
}

export default ThreeByThree;