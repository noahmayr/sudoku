import Path from '../SVG/Path';
import useRegionPath, { RegionCells, UseRegionPathProps } from './useRegionPath';


export interface RegionProps extends UseRegionPathProps, HasClassName {
}

type SimplePath = [Point, Point];

const Region = ({ className, ...props }: RegionProps) => {
    const commands = useRegionPath(props);
    return (
        <Path commands={commands} className={className} />
    )
}

export default Region;