import { useSelector } from "react-redux";
import classes from "./Regions.module.scss";
import UniqueRegion from "../Region/UniqueRegion";
import { selectGame } from "../../state/slice/game";

const Regions = () => {
    const regions = useSelector(selectGame.rules)?.regions;

    if (regions === undefined) {
        return null;
    }

    return (<>
        {regions.map(
            (region, index) => (
                <UniqueRegion key={index} className={classes.root} region={region} />
            ),
        )}
    </>);
};

export default Regions;
