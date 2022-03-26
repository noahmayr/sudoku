import { useMemo } from 'react';
import UniqueRegion from './UniqueRegion';
import { RegionCells } from '../Region/useRegionPath';
import { CellIndex } from '../Cell/useCells';
import { getKey } from '../../util';

interface UniqueRowsProps {
    cells: CellIndex
}

const UniqueRows = ({cells}: UniqueRowsProps) => {
    const regions = useMemo(() => {
        return Array.from(Array(9).keys()).map(y => {
            const cells = Array.from(Array(9).keys()).map(x => {
                return { x, y };
            });
            const region: RegionCells = {};
            cells.forEach((cell) => region[getKey(cell)] = true);
            return region;
        });
    }, [])
    return (<>
        {regions.map((region, index) =>
            (<UniqueRegion key={index} region={region} cells={cells} />)
        )}
    </>)
}

export default UniqueRows;