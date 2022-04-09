import { PropsWithChildren } from "react";
import cls from "classnames";
import useSelection from "../../hooks/useSelection";
import classes from "./Svg.module.scss";

interface SvgProps extends HasClassName {
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
            maxHeight: `min(max-content, ${height * 80}px)`,
            fontSize: `${1 / 32}rem`,
        },
    };
};

const Svg = ({ children, className, ...props }: PropsWithChildren<SvgProps>) => {
    const svgProps = useSvg(props);
    return (
        <svg
            id="svgrenderer"
            xmlns="http://www.w3.org/2000/svg"
            className={cls(classes.svg, className)}
            version="1.1"
            vectorEffect="nonScalingStroke"
            {...svgProps}
        >
            {children}
        </svg>
    );
};

export default Svg;
