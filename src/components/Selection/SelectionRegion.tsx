import { memo } from "react";
import useInput from "../../hooks/useInput";
import { useSelectionState } from "../../state/slice/selection";
import RegionPath from "../Region/RegionPath";
import classes from "./Selection.module.scss";

const SelectionRegion = () => {
    useInput();
    const selection = useSelectionState();
    return (
        <g id="selection">
            <RegionPath className={classes.root} region={selection} />
        </g>
    );
};

export default memo(SelectionRegion);
