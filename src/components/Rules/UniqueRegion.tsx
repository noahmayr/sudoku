import { useInputState } from '../../context/Input';
import { useValidator } from '../../context/Validation';
import { getKey } from '../../hooks/useSelection';
import { CellIndex, CellInterface, CellValue } from '../Cell/useCells';
import Region, { RegionProps } from '../Region/Region';

interface UniqueRegionProps extends RegionProps {
    cells: CellIndex;
}

const UniqueRegion = ({ className, region }: UniqueRegionProps) => {
    useValidator(region, ({items}) => {
        const seen: Record<CellValue, CellInterface[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        items.forEach(({cell, state}) => {
            const {value, given} = state;
            const val = value ?? given;
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
    }, [region]);

    return (<Region className={className} region={region} />);
}

export default UniqueRegion;