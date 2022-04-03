import { useMemo } from "react";
import UniqueRegion from "./UniqueRegion";
import { CellInterface } from "../Cell/useCells";
import { range } from "../../util";
import getKey from "../../state/util/getKey";
import { Region } from "../../state/slice/game";


const UniqueRows = () => {
    const regions = useMemo(() => range(9).map(y => {
        const cells: CellInterface[] = range(9).map(x => {
            return { x, y };
        });
        return cells.reduce<Region>(
            (region, cell): Region => region.add(getKey(cell)),
            new Set(),
        );
    }), []);
    return (<>
        {regions.map(
            (region, index) => <UniqueRegion key={index} region={region} />,
        )}
    </>);
};

export default UniqueRows;
