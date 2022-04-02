import { useMemo } from "react";
import UniqueRegion from "./UniqueRegion";
import { RegionCells } from "../Region/useRegionPath";
import { CellInterface } from "../Cell/useCells";
import { getKey, range } from "../../util";


const UniqueRows = () => {
    const regions = useMemo(() => range(9).map(y => {
        const cells: CellInterface[] = range(9).map(x => {
            return { x, y };
        });
        return cells.map((cell): RegionCells => {
            return { [getKey(cell)]: true };
        }).reduce((a, b) => Object.assign(a, b), {});
    }), []);
    return (<>
        {regions.map(
            (region, index) => <UniqueRegion key={index} region={region} />,
        )}
    </>);
};

export default UniqueRows;
