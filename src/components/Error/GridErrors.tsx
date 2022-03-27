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
    filled: boolean;
}

const GridErrors = ({ size, cells }: GridErrorsProps) => {
    const results = useValidation(cells);

    const state = useMemo(() => {
        return results.map(({ errorCells, filled = true }): ValidationState => {
            return {
                errors: Object.keys(errorCells)
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
                filled: a.filled && b.filled,
            };
        }, { errors: {}, filled: true });
    }, [JSON.stringify(cells), JSON.stringify(results)]);

    if (state.filled && Object.keys(state.errors).length) {
        return (<rect className={classes.filled} {...size} />);
    }

    return (<Region className={classes.root} region={state.errors} />);
};

export default GridErrors;
