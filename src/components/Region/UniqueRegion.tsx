import { CellIndex } from '../Cell/useCells';
import Region, { RegionProps } from './Region';

interface UniqueRegionProps extends RegionProps {
    cells: CellIndex;
}

const UniqueRegion = ({className, region}: UniqueRegionProps) => {
    return (<Region className={className} region={region} />);
}

export default UniqueRegion;