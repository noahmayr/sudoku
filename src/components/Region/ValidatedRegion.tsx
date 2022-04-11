import { memo } from "react";
import cls from "classnames";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useValidator, Validator, ValidatorItem } from "../../context/Validation";
import { Region } from "../../state/slice/game";
import { CellValue } from "../../state/slice/input";
import RegionPath, { RegionProps } from "./RegionPath";
import { selectSettings } from "../../state/slice/settings";

const filterItems = (
    items: ValidatorItem[],
    predicate: (item: ValidatorItem) => unknown,
): Region => (
    items.filter(predicate).reduce<Region>((set, { key }) => set.add(key), new Set())
);

export const uniqueConstraintValidator: Validator = (items: ValidatorItem[]) => {
    const seen: Map<CellValue, number> = new Map();
    const filled = items.length > 0 && items.map(({ state: { value } }) => {
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

const settingsSelector = createSelector(selectSettings, ({ validation }) => {
    const { errors, warnings } = validation;
    const options = ["both", "region"];
    return {
        errors: options.includes(errors as string),
        warnings: options.includes(warnings as string),
    };
});

const ValidatedRegion = (
    {
        region,
        className,
        validator = uniqueConstraintValidator,
        validationClasses = {},
    }: ValidatedRegionProps,
) => {
    const result = useValidator(region, validator);
    const settings = useSelector(settingsSelector);
    const classConditions = Object.fromEntries([
        [validationClasses.error, result.errors.size && settings.errors],
        [validationClasses.warning, result.warnings.size && settings.warnings],
    ].filter(([key]) => key !== undefined));

    return (<RegionPath className={cls(className, classConditions)} region={region} />);
};

export default memo(ValidatedRegion);
