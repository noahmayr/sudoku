import { useSelector } from "react-redux";
import UniqueRegion from "../Region/UniqueRegion";
import { selectGame } from "../../state/slice/game";

const Rows = () => {
    const regions = useSelector(selectGame.rules)?.rows;

    if (regions === undefined) {
        return null;
    }

    return (<>
        {regions.map(
            (region, index) => <UniqueRegion key={index} region={region} />,
        )}
    </>);
};

export default Rows;
