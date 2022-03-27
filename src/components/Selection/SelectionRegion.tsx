import { useSelectionState } from "../../context/Selection";
import Region from "../Region/Region";
import classes from "./Selection.module.scss";
const SelectionRegion = () => {
    const selection = useSelectionState();
    return (
        <g id="selection">
            <Region className={classes.root} region={selection} />
        </g>
    );
};

export default SelectionRegion;
