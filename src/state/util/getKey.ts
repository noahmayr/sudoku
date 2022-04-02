import { PositionKey } from "../slice/game";

const getKey = ({ x, y }: Point): PositionKey => `${x}|${y}`;

export default getKey;
