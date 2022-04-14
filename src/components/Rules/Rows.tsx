import { useSelector } from "react-redux";
import ValidatedRegion from "../Region/ValidatedRegion";
import { selectGame } from "../../state/slice/game";
import classes from "./Regions.module.scss";


const Rows = () => {
    const rows = useSelector(selectGame.rules)?.rows;

    if (rows === undefined) {
        return null;
    }

    return (<>
        {rows.map(
            (row, index) => (
                <ValidatedRegion
                    key={index}
                    region={row}
                    validationClasses={{ error: classes.error, warning: classes.warning }}
                />
            ),
        )}
    </>);
};

export default Rows;
