import { useMemo } from "react";
import { useValidation } from "../../context/Validation";
import { CellIndex } from "../Cell/useCells";
import Region from "../Region/Region";
import { RegionCells } from "../Region/useRegionPath";
import classes from "./Validation.module.scss";

interface GridErrorsProps {
    cells: CellIndex;
    size: Size;
}

interface ValidationState {
    errors: RegionCells;
    warnings: RegionCells;
    filled: boolean;
}

const Validation = ({ size, cells }: GridErrorsProps) => {
    const results = useValidation(cells);

    const state = useMemo(
        () => results.map(
            ({ errors, warnings, filled = true }): ValidationState => {
                return {
                    errors, warnings, filled,
                };
            },
        ).reduce(
            (acc: ValidationState, next: ValidationState) => {
                Object.assign(acc.errors, next.errors);
                Object.assign(acc.warnings, next.warnings);
                acc.filled &&= next.filled;
                return acc;
            },
            {
                errors: {}, warnings: {}, filled: true,
            },
        ),
        [JSON.stringify(cells), JSON.stringify(results)],
    );

    if (state.filled && Object.keys(state.errors).length === 0) {
        return (<rect className={classes.success} {...size} />);
    }

    return (
        <>
            <Region className={classes.error} region={state.errors} />
            <Region className={classes.warning} region={state.warnings} />
        </>
    );
};

export default Validation;
