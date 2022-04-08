import { memo } from "react";
import { COLORS } from "../../state/slice/game";
import { useAppSelector } from "../../state/store";
import RegionPath from "../Region/RegionPath";
import classes from "./ColoredRegions.module.scss";

const ColoredRegions = () => {
    const coloredRegions = useAppSelector(state => state.game?.extras?.coloredRegions);
    if (coloredRegions === undefined) {
        return null;
    }

    return (
        <>
            {
                Array.from(coloredRegions).map(
                    ([color, region]) => (
                        <RegionPath
                            key={color}
                            region={region}
                            className={classes.root}
                            style={{ color: COLORS[color] }}
                        />
                    ),
                )
            }
        </>
    );
};

export default memo(ColoredRegions);
