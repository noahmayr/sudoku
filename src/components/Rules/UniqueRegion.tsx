import { memo } from "react";
import { useValidator, ValidatorItem } from "../../context/Validation";
import { Region } from "../../state/slice/game";
import { CellValue } from "../../state/slice/input";
import RegionPath, { RegionProps } from "../Region/RegionPath";

const filterItems = (
    items: ValidatorItem[],
    predicate: (item: ValidatorItem) => unknown,
): Region => (
    items.filter(predicate).reduce<Region>((set, { key }) => set.add(key), new Set())
);

const UniqueRegion = ({ className, region }: RegionProps) => {
    useValidator(
        region,
        items => {
            const seen: Map<CellValue, number> = new Map();
            const filled = items.map(({ state: { value } }) => {
                if (value === undefined) {
                    return false;
                }
                seen.set(value, (seen.get(value) ?? 0) + 1);
                return true;
            }).reduce((a, b) => a && b, true);

            const errors = filterItems(
                items,
                ({ state }) => state.value !== undefined && (seen.get(state.value) ?? 0) > 1,
            );

            const warnings = filterItems(
                items,
                ({ state }) => state.value === undefined && Array.from(seen.keys()).some(
                    (value) => state.center.has(value) || state.corner.has(value),
                ),
            );

            return {
                filled, errors, warnings,
            };
        },
    );

    return (<RegionPath className={className} region={region} />);
};

export default memo(UniqueRegion);
