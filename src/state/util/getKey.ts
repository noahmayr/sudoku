import { PositionKey } from "../slice/game";
import { CellValue } from "../slice/input";

export const decodeKey = (key: PositionKey): Position => {
    const values = key.split("|").map((val) => parseInt(val)) as [CellValue, CellValue];
    return {
        x: values[0],
        y: values[1],
    };
};

const getKey = ({ x, y }: Position): PositionKey => `${x}|${y}`;

export default getKey;
