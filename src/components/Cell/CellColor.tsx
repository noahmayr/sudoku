import { memoize } from "lodash";
import { CellValue, CellColors } from "../../state/slice/input";
import Path, { PathCommand } from "../SVG/Path";

const rotate = (
    point: Position,
    angle: number,
    center: Position = { x: 0.5, y: 0.5 },
): Position => {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return {
        x: (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
        y: (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y,
    };
};

const segmentPaths = memoize((amount: number): PathCommand[][] => {
    if (amount < 1) {
        return [];
    }
    if (amount === 1) {
        return [
            [
                { type: "M", vector: { x: 0, y: 0 } },
                { type: "L", vector: { x: 1, y: 0 } },
                { type: "L", vector: { x: 1, y: 1 } },
                { type: "L", vector: { x: 0, y: 1 } },
                { type: "Z" },
            ],
        ];
    }
    if (amount === 2) {
        return [
            [
                { type: "M", vector: { x: 0, y: 0 } },
                { type: "L", vector: { x: 1, y: 1 } },
                { type: "L", vector: { x: 1, y: 0 } },
                { type: "Z" },
            ],
            [
                { type: "M", vector: { x: 0, y: 0 } },
                { type: "L", vector: { x: 1, y: 1 } },
                { type: "L", vector: { x: 0, y: 1 } },
                { type: "Z" },
            ],
        ];
    }
    if (amount > 2) {
        const segments: PathCommand[][] = [];
        const angle = 360 / amount;
        const start = { x: 0.5, y: -1 };
        const center = { x: 0.5, y: 0.5 };
        let previous: Position = start;
        for (let i = 1; i <= amount; i += 1) {
            const point = rotate(start, angle * i, center);
            segments.push([
                { type: "M", vector: center },
                { type: "L", vector: previous },
                { type: "L", vector: point },
                { type: "Z" },
            ]);
            previous = point;
        }
        return segments.reverse();
    }
    return [];
});

interface CellColorProps {
    colors: Set<CellValue>;
    className?: string;
}

const CellColor = ({ colors, className }: CellColorProps) => {
    const segments = segmentPaths(colors.size);
    return (
        <>
            {
                Array.from(colors).sort().map((color, index) => (
                    <Path
                        key={color}
                        commands={segments[index] ?? []}
                        style={{ fill: CellColors[color] }}
                        className={className}
                    />
                ))
            }
        </>
    );
};

export default CellColor;
