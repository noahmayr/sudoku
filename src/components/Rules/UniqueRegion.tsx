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
        }).reduce((a, b) => a && b, true);
        const errors: RegionCells = {};

        Object.values(seen).filter(cells => cells.length > 1).flat(1).forEach(cell => {
            errors[getKey(cell)] = true;
        });

        const takenValues = Object.entries(seen).filter(([, cells]) => cells.length)
            .map((([key]) => parseInt(key) as CellValue));

        const warnings = items.filter(
            ({
                state: {
                    value: v,
                    given: val = v,
                    center,
                    corner,
                },
            }) => takenValues.some(
                value => val === undefined && (center?.has(value) || corner?.has(value)),
            ),
        ).map(({ cell }): RegionCells => {
            return { [getKey(cell)]: true };
        }).reduce((a, b) => Object.assign(a, b), {});

        return {
            filled,
            errors,
            warnings,
        };
    }, [region]);

    return (<Region className={className} region={region} />);
};

export default UniqueRegion;
