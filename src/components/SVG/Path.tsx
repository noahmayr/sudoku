export type VectorPathCommandType = "M" | "m" | "L" | "l";
export type ScalarPathCommandType = "H" | "h" | "V" | "v";
export type SimplePathCommandType = "Z" | "z";
export type PathCommandType = SimplePathCommandType | ScalarPathCommandType | VectorPathCommandType;

export interface VectorPathCommand {
    type: VectorPathCommandType;
    vector: Vector | Point
}

export interface ScalarPathCommand {
    type: ScalarPathCommandType;
    scalar: number;
}

export interface SimplePathCommand {
    type: SimplePathCommandType;
}

export type PathCommand = SimplePathCommand | ScalarPathCommand | VectorPathCommand;

interface PathProps extends HasClassName {
    commands: PathCommand[];
}

const stringifyPathCommands = (commands: PathCommand[]): string => {
    return commands.map(command => {
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
        }
    }).join(" ");
};

const Path = ({ className, commands }: PathProps) => {
    return <path
        className={className}
        d={stringifyPathCommands(commands)}
    />;
};

export default Path;
