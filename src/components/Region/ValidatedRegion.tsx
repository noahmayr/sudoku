import { memo } from "react";
import cls from "classnames";
import { useValidator, Validator, ValidatorItem } from "../../context/Validation";
import { Region } from "../../state/slice/game";
import { CellValue } from "../../state/slice/input";
import RegionPath, { RegionProps } from "./RegionPath";

const filterItems = (
    items: ValidatorItem[],
    predicate: (item: ValidatorItem) => unknown,
): Region => (
    items.filter(predicate).reduce<Region>((set, { key }) => set.add(key), new Set())
);

export const uniqueConstraintValidator: Validator = (items: ValidatorItem[]) => {
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
};

interface ValidationClassNames {
    error?: string;
    warning?: string;
}

interface ValidatedRegionProps extends RegionProps {
    validator?: Validator;
    validationClasses?: ValidationClassNames;
}

const ValidatedRegion = (
    {
        region,
        className,
        validator = uniqueConstraintValidator,
        validationClasses = {},
    }: ValidatedRegionProps,
) => {
    const result = useValidator(region, validator);
    const classConditions = Object.fromEntries([
        [validationClasses.error, result.errors.size],
        [validationClasses.warning, result.warnings.size],
    ].filter(([key]) => key !== undefined));

    return (<RegionPath className={cls(className, classConditions)} region={region} />);
};

export default memo(ValidatedRegion);
