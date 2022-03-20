import { getKey } from '../../hooks/useSelection';
import { useMemo } from 'react';
import UniqueRegion from './UniqueRegion';
import { RegionCells } from '../Region/useRegionPath';
import { CellIndex } from '../Cell/useCells';

interface UniqueColumnsProps {
    cells: CellIndex
}

const UniqueColumns = ({cells}: UniqueColumnsProps) => {
    const regions = useMemo(() => {
        return Array.from(Array(9).keys()).map(x => {
            const cells = Array.from(Array(9).keys()).map(y => {
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

export default UniqueColumns;