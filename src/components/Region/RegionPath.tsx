import Path, { PathProps } from "../SVG/Path";
import useRegionPath, { UseRegionPathProps } from "./useRegionPath";


export interface RegionProps extends UseRegionPathProps, Omit<PathProps, "commands"> {
}

const RegionPath = ({ className, style, ...props }: RegionProps) => {
    const commands = useRegionPath(props);
    return (
        <Path commands={commands} className={className} style={style} />
    );
};

export default RegionPath;
