import Path from "../SVG/Path";
import useRegionPath, { UseRegionPathProps } from "./useRegionPath";


export interface RegionProps extends UseRegionPathProps, HasClassName {
}

const Region = ({ className, ...props }: RegionProps) => {
    const commands = useRegionPath(props);
    return (
        <Path commands={commands} className={className} />
    );
};

export default Region;
