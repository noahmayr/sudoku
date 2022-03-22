import { useMemo } from "react";
import { useValidation } from "../../context/Validation";
import { CellIndex } from "../Cell/useCells";
import Region from "../Region/Region";
import { RegionCells } from "../Region/useRegionPath";
import classes from './GridErrors.module.scss';

interface GridErrorsProps {
    cells: CellIndex;
}

const GridErrors = ({cells}: GridErrorsProps) => {
    const validationResults = useValidation(cells);
    const region = useMemo(() => {
        return validationResults.map(({errorCells}) => {
            const region: RegionCells = {};
            Object.keys(errorCells).forEach(key => {
                region[key] = true;
            })
            return region;
        }).reduce((a, b) => {
            return {...a, ...b};
        }, {})
    }, [JSON.stringify(cells), JSON.stringify(validationResults)]);
    return (<Region className={classes.root} region={region}/>);
}

export default GridErrors;