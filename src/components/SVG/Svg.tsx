import { PropsWithChildren } from "react";
import useSelection from "../../hooks/useSelection";
import classes from "./Svg.module.scss";

interface SvgProps {
    size: Size;
    padding: number;
}

const useSvg = ({ size, padding = 0.25 }: SvgProps) => {
    const { ref } = useSelection(padding);
    const { x, y, width, height } = {
        x: 0 - padding,
        y: 0 - padding,
        width: size.width + padding * 2,
        height: size.height + padding * 2,
    };
    return {
        ref,
        viewBox: `${x} ${y} ${width} ${height}`,
        style: {
            height: height * 80,
            fontSize: `${1 / 32}rem`,
        },
    };
};

const Svg = ({ children, ...props }: PropsWithChildren<SvgProps>) => {
    const svgProps = useSvg(props);
    return (
        <svg
            id="svgrenderer"
            className={classes.svg}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            vectorEffect="nonScalingStroke"
            {...svgProps}
        >
            {children}
        </svg>
    );
};

export default Svg;
