import { useSelector } from "react-redux";
import classes from "./Regions.module.scss";
import ValidatedRegion from "../Region/ValidatedRegion";
import { selectGame } from "../../state/slice/game";

const Regions = () => {
    const regions = useSelector(selectGame.rules)?.regions;

    if (regions === undefined) {
        return null;
    }

    return (<>
        {regions.map(
            (region, index) => (
                <ValidatedRegion
                    key={index}
                    className={classes.root}
                    region={region}
                    validationClasses={{ error: classes.error, warning: classes.warning }}
                />
            ),
        )}
    </>);
};

export default Regions;
