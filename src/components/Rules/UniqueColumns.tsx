import { useMemo } from "react";
import UniqueRegion from "./UniqueRegion";
import { RegionCells } from "../Region/useRegionPath";
import { getKey, range } from "../../util";
import { CellInterface } from "../Cell/useCells";


const UniqueColumns = () => {
    const regions = useMemo(() => {
        return Array.from(Array(9).keys()).map(x => {
            const cells: CellInterface[] = range(9).map(y => {
                return { x, y };
            });
            return cells.map((cell): RegionCells => { return { [getKey(cell)]: true }; })
                .reduce((a, b) => { return Object.assign(a, b); }, {});
        });
    }, []);
    return (<>
        {regions.map((region, index) => {
            return (<UniqueRegion key={index} region={region} />);
        })}
    </>);
};

export default UniqueColumns;
