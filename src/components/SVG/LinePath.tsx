import Path, { PathCommand } from "./Path";

export interface Line {
    start: Point;
    end: Point;
}

interface LinePathProps extends HasClassName {
    lines: Line[];
}

const LinePath = ({ className, lines }: LinePathProps) => {
    const commands = lines.map(({start, end}): PathCommand[] => [{type: 'M', vector: start},{type: 'L', vector: end}]).flat();
    return <Path className={className} commands={commands}/>;
}

export default LinePath;