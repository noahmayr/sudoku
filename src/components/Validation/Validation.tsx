import { memo } from "react";
import { useSelector } from "react-redux";
import { useValidation } from "../../context/Validation";
import { Region, selectGame } from "../../state/slice/game";
import RegionPath from "../Region/RegionPath";
import classes from "./Validation.module.scss";

interface ValidationState {
    errors: Region;
    warnings: Region;
    filled: boolean;
}

const Validation = () => {
    const results = useValidation();
    const dimensions = useSelector(selectGame.dimensions);

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

    if (dimensions !== undefined && state.filled && state.errors.size === 0) {
        return (<rect className={classes.success} {...dimensions} />);
    }

    return (
        <>
            <RegionPath className={classes.error} region={state.errors} />
            <RegionPath className={classes.warning} region={state.warnings} />
        </>
    );
};

export default memo(Validation);
