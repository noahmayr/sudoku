export type VectorPathCommandType = "M" | "m" | "L" | "l";
export type ScalarPathCommandType = "H" | "h" | "V" | "v";
export type SimplePathCommandType = "Z" | "z";
export type PathCommandType = SimplePathCommandType | ScalarPathCommandType | VectorPathCommandType;

export interface VectorPathCommand {
    type: VectorPathCommandType;
    vector: Vector | Position
}

export interface ScalarPathCommand {
    type: ScalarPathCommandType;
    scalar: number;
}

export interface SimplePathCommand {
    type: SimplePathCommandType;
}

export type PathCommand = SimplePathCommand | ScalarPathCommand | VectorPathCommand;

export interface PathProps extends HasClassName {
    commands: PathCommand[];
    style?: React.CSSProperties;
}

const stringifyPathCommands = (commands: PathCommand[]): string => commands.map(command => {
    switch (command.type) {
        case "M":
        case "m":
        case "L":
        case "l":
            return `${command.type}${command.vector.x} ${command.vector.y}`;
        case "H":
        case "h":
        case "V":
        case "v":
            return `${command.type}${command.scalar}`;
        case "Z":
        case "z":
            return `${command.type}`;
        default:
            return undefined;
    }
}).join(" ");

const Path = ({ className, style, commands }: PathProps) => (
    <path className={className} style={style} d={stringifyPathCommands(commands)} />
);

export default Path;
