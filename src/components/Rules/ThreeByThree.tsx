import { useMemo } from "react";
import classes from "./ThreeByThree.module.scss";
import UniqueRegion from "./UniqueRegion";
import { RegionCells } from "../Region/useRegionPath";
import { CellInterface } from "../Cell/useCells";
import { getKey, range } from "../../util";

const ThreeByThree = () => {
    const regions = useMemo(() => {
        const topLefts: Point[] = range(3).map(y => range(3).map(x => {
            return { x: x * 3, y: y * 3 };
        })).flat(1);
        return topLefts.map(({ x, y }) => {
            const cells: CellInterface[] = range(3).map(deltaY => range(3).map(deltaX => {
                return { x: x + deltaX, y: y + deltaY };
            })).flat(1);
            return cells.map((cell): RegionCells => {
                return { [getKey(cell)]: true };
            })
                .reduce((a, b) => Object.assign(a, b), {});
        });
    }, []);
    return (<>
        {regions.map(
            (region, index) => (
                <UniqueRegion key={index} className={classes.root} region={region} />
            ),
        )}
    </>);
};

export default ThreeByThree;
