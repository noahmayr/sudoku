import { useMemo } from "react";
import { useValidation } from "../../context/Validation";
import { CellIndex } from "../Cell/useCells";
import Region from "../Region/Region";
import { RegionCells } from "../Region/useRegionPath";
import Path from "../SVG/Path";
import classes from "./GridErrors.module.scss";

interface GridErrorsProps {
    cells: CellIndex;
    size: Size;
}

interface ValidationState {
    errors: RegionCells;
    filled: boolean;
}

const GridErrors = ({size, cells}: GridErrorsProps) => {
    const validationResults = useValidation(cells);
    const {errors, filled} = useMemo(() => {
        return validationResults.map(({errorCells, filled = true}): ValidationState => {
            const region: RegionCells = {};
            Object.keys(errorCells).forEach(key => {
                region[key] = true;
            });
            return {errors: region, filled};
        }).reduce((a: ValidationState, b: ValidationState) => {
            return {errors: {...a.errors, ...b.errors}, filled: a.filled && b.filled};
        }, {errors: {}, filled: true});
    }, [JSON.stringify(cells), JSON.stringify(validationResults)]);
    if (filled && Object.keys(errors).length) {
        return (<rect className={classes.filled} {...size}/>);
    }
    return (<Region className={classes.root} region={errors}/>);
};

export default GridErrors;
