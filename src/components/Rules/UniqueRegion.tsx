import { useValidator } from "../../context/Validation";
import { getKey } from "../../util";
import { CellIndex, CellInterface, CellValue } from "../Cell/useCells";
import Region, { RegionProps } from "../Region/Region";

interface UniqueRegionProps extends RegionProps {
    cells: CellIndex;
}

const UniqueRegion = ({ className, region }: UniqueRegionProps) => {
    useValidator(region, ({items}) => {
        const seen: Record<CellValue, CellInterface[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };
        const filled = items.map(({cell, state}) => {
            const {value, given} = state;
            const val = value ?? given;
            if (typeof val !== "number") {
                return false;
            }
            seen[val]?.push(cell);
            return true;
        }).reduce((a, b) => a && b, true);
        const errorCells: CellIndex = {};

        Object.values(seen).filter(cells => cells.length > 1).flat(1).forEach(cell => {
            errorCells[getKey(cell)] = cell;
        });

        return {
            filled,
            errorCells
        };
    }, [region]);

    return (<Region className={className} region={region} />);
};

export default UniqueRegion;
