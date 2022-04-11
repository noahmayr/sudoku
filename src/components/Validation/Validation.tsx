import { createSelector } from "@reduxjs/toolkit";
import { memo } from "react";
import { useSelector } from "react-redux";
import cls from "classnames";
import { useValidation } from "../../context/Validation";
import { Region, selectGame } from "../../state/slice/game";
import { selectSettings } from "../../state/slice/settings";
import RegionPath from "../Region/RegionPath";
import classes from "./Validation.module.scss";

interface ValidationState {
    errors: Region;
    warnings: Region;
    filled: boolean;
}

const settingsSelector = createSelector(selectSettings, ({ validation }) => {
    const { errors, warnings, success } = validation;
    const options = ["both", "cell"];
    return {
        errors: options.includes(errors as string),
        warnings: options.includes(warnings as string),
        success,
    };
});

const Validation = () => {
    const results = useValidation();
    const dimensions = useSelector(selectGame.dimensions);
    const settings = useSelector(settingsSelector);

    const state = results.map(
        ({ errors, warnings, filled = true }): ValidationState => {
            return {
                errors, warnings, filled,
            };
        },
    ).reduce(
        (acc: ValidationState, next: ValidationState) => {
            next.errors.forEach(acc.errors.add, acc.errors);
            next.warnings.forEach(acc.warnings.add, acc.warnings);
            acc.filled &&= next.filled;
            return acc;
        },
        {
            errors: new Set(), warnings: new Set(), filled: true,
        },
    );

    if (settings.success && results.length && state.filled && state.errors.size === 0) {
        return (<rect className={classes.success} {...dimensions} />);
    }

    return (
        <>
            <RegionPath
                className={cls({ [classes.error]: settings.errors })}
                region={state.errors}
            />
            <RegionPath
                className={cls({ [classes.warning]: settings.warnings })}
                region={state.warnings}
            />
        </>
    );
};

export default memo(Validation);
