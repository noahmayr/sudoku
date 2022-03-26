import Path, { PathCommand } from "./Path";

export interface Line {
    start: Point;
    vector: Vector;
}

interface LinePathProps extends HasClassName {
    lines: Line[];
}

const LinePath = ({ className, lines }: LinePathProps) => {
    const commands = lines.map(({start, vector}): PathCommand[] => [{type: 'M', vector: start},{type: 'l', vector}]).flat();
    return <Path className={className} commands={commands}/>;
}

export default LinePath;