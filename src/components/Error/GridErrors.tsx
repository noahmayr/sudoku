import { useMemo } from "react";
import { useValidation } from "../../context/Validation";
import { CellIndex } from "../Cell/useCells";
import Region from "../Region/Region";
import { RegionCells } from "../Region/useRegionPath";
import classes from "./GridErrors.module.scss";

interface GridErrorsProps {
    cells: CellIndex;
    size: Size;
}

interface ValidationState {
    errors: RegionCells;
    warnings: RegionCells;
    filled: boolean;
}

const GridErrors = ({ size, cells }: GridErrorsProps) => {
    const results = useValidation(cells);

    const state = useMemo(() => {
        return results.map(({ errorCells, warningCells, filled = true }): ValidationState => {
            return {
                errors: Object.keys(errorCells)
                    .map((key): RegionCells => { return { [key]: true }; })
                    .reduce((a, b) => { return Object.assign(a, b); }, {}),
                warnings: Object.keys(warningCells)
                    .map((key): RegionCells => { return { [key]: true }; })
                    .reduce((a, b) => { return Object.assign(a, b); }, {}),
                filled,
            };
        }).reduce((a: ValidationState, b: ValidationState) => {
            return {
                errors: {
                    ...a.errors,
                    ...b.errors,
                },
                warnings: {
                    ...a.warnings,
                    ...b.warnings,
                },
                filled: a.filled && b.filled,
            };
        }, { errors: {}, warnings: {}, filled: true });
    }, [JSON.stringify(cells), JSON.stringify(results)]);

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

export default GridErrors;
