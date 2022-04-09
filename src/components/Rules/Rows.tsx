import { useSelector } from "react-redux";
import ValidatedRegion from "../Region/ValidatedRegion";
import { selectGame } from "../../state/slice/game";
import classes from "./Regions.module.scss";


const Rows = () => {
    const regions = useSelector(selectGame.rules)?.rows;

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

export default Rows;
