import { useSelector } from "react-redux";
import { memo } from "react";
import ValidatedRegion from "../Region/ValidatedRegion";
import { selectGame } from "../../state/slice/game";
import classes from "./Regions.module.scss";

const Columns = () => {
    const columns = useSelector(selectGame.rules)?.columns;

    if (columns === undefined) {
        return null;
    }

    return (<>
        {columns.map(
            (column, index) => (
                <ValidatedRegion
                    key={index}
                    region={column}
                    validationClasses={{ error: classes.error, warning: classes.warning }}
                />
            ),
        )}
    </>);
};

export default memo(Columns);
