import { memo, useMemo } from "react";
import { useValidator } from "../../context/Validation";
import { PositionKey, Region } from "../../state/slice/game";
import { CellValue } from "../../state/slice/input";
import getKey from "../../state/util/getKey";
import RegionPath, { RegionProps } from "../Region/RegionPath";

const UniqueRegion = ({ className, region: oldRegion }: RegionProps) => {
    const region: Region = useMemo(
        () => {
            const keys = Object.keys(oldRegion).map(oldKey => getKey(JSON.parse(oldKey) as Point));
            return new Set(keys);
        },
        [oldRegion],
    );

    useValidator(region, ({ items }) => {
        // console.log("validating");
        const seen: Record<CellValue, PositionKey[]> = {
            1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
        };
        const filled = items.map(({ key, state }) => {
            const { value } = state;
            if (typeof value !== "number") {
                return false;
            }
            seen[value]?.push(key);
            return true;
        }).reduce((a, b) => a && b, true);
        const errors = Object.values(seen).filter(keys => keys.length > 1).flat(1)
            .reduce<Region>((set, key) => set.add(key), new Set());

        const takenValues = Object.entries(seen).filter(([, cells]) => cells.length)
            .map((([key]) => parseInt(key) as CellValue));

        const warnings = items.filter(
            ({ state: { value, center, corner } }) => takenValues.some(
                taken => value === undefined && (center.has(taken) || corner.has(taken)),
            ),
        ).reduce<Region>((set, { key }) => set.add(key), new Set());

        return {
            filled,
            errors,
            warnings,
        };
    }, [region]);

    return (<RegionPath className={className} region={oldRegion} />);
};

export default memo(UniqueRegion);
