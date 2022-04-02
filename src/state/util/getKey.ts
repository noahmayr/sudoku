import { PositionKey } from "../types.d";

const getKey = ({ x, y }: Point): PositionKey => `${x}|${y}`;

export default getKey;
