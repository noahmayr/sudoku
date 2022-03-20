import { useMemo } from 'react';
import { useValidator } from '../../context/Validation';
import { getKey } from '../../hooks/useSelection';
import { CellIndex } from '../Cell/useCells';
import Region, { RegionProps } from './Region';
import { RegionCells } from './useRegionPath';

interface UniqueRegionProps extends RegionProps {
    cells: CellIndex;
}

const UniqueRegion = ({ className, region }: UniqueRegionProps) => {
    // const errors = useMemo(() => {
    //     const cells = Object.keys(region).map((key) => cellIndex[key]);
    //     const seen: Record<CellValue, CellInterface[] | undefined> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

    //     cells.forEach(cell => {
    //         const val = cell.given ?? cell.value;
    //         if (typeof val !== 'number') {
    //             return;
    //         }
    //         seen[val]?.push(cell);
    //     });

    //     return seen;
    // }, [JSON.stringify(region), JSON.stringify(cellIndex)]);

    useValidator(cellIndex => {
        const regionCells = Object.keys(region).map((key) => cellIndex[key]);
        const seen: Record<CellValue, CellInterface[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        regionCells.forEach(cell => {
            const val = cell.given ?? cell.value;
            if (typeof val !== 'number') {
                return;
            }
            seen[val]?.push(cell);
        });
        const errorCells: CellIndex = {};

        Object.values(seen).filter(cells => cells.length > 1).flat(1).forEach(cell => {
            errorCells[getKey(cell)] = cell;
        });

        return {
            errorCells
        }
    }, [region])

    return (<Region className={className} region={region} />);
}

export default UniqueRegion;