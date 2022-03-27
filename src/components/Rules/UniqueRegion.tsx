import { CellValue } from "../../context/Input";
import { useValidator } from "../../context/Validation";
import { getKey } from "../../util";
import { CellInterface } from "../Cell/useCells";
import Region, { RegionProps } from "../Region/Region";
import { RegionCells } from "../Region/useRegionPath";

const UniqueRegion = ({ className, region }: RegionProps) => {
    useValidator(region, ({ items }) => {
        const seen: Record<CellValue, CellInterface[]> = {
            1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
        };
        const filled = items.map(({ cell, state }) => {
            const { value, given } = state;
            const val = value ?? given;
            if (typeof val !== "number") {
                return false;
            }
            seen[val]?.push(cell);
            return true;
        }).reduce((a, b) => { return a && b; }, true);
        const errors: RegionCells = {};

        Object.values(seen).filter(cells => { return cells.length > 1; }).flat(1).forEach(cell => {
            errors[getKey(cell)] = true;
        });

        const takenValues = Object.entries(seen).filter(([, cells]) => { return cells.length; })
            .map((([key]) => { return parseInt(key) as CellValue; }));

        return {
            filled,
            errors,
            warnings: items.filter(({
                state: {
                    value: v, given: val = v, center, corner,
                },
            }) => {
                return takenValues.some(
                    value => {
                        return val === undefined && (center?.has(value) || corner?.has(value));
                    },
                );
            }).map(({ cell }): RegionCells => {
                return { [getKey(cell)]: true };
            }).reduce((a, b) => { return Object.assign(a, b); }, {}),
        };
    }, [region]);

    return (<Region className={className} region={region} />);
};

export default UniqueRegion;
