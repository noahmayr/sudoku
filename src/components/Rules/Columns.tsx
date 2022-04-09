import { useSelector } from "react-redux";
import ValidatedRegion from "../Region/ValidatedRegion";
import { selectGame } from "../../state/slice/game";
import classes from "./Regions.module.scss";

const Columns = () => {
    const regions = useSelector(selectGame.rules)?.columns;

    if (regions === undefined) {
        return null;
    }

    return (<>
        {regions.map(
            (region, index) => (
                <ValidatedRegion
                    key={index}
                    region={region}
                    validationClasses={{ error: classes.error, warning: classes.warning }}
                />
            ),
        )}
    </>);
};

export default Columns;
