import lzutf8, { CompressedEncoding } from "lzutf8";
import { serialize, deserialize } from "superjson";
import { STANDARD_RULES } from "./compressedGames/regular";
import { convertRules } from "./compressedGames/util";
import { range } from "../../util";
import { gameActions, GameSettings } from "../slice/game";
import { inputActions, GivenMap } from "../slice/input";
import { AppDispatch } from "../store";
import getKey from "../util/getKey";

const buildGrid = ({ width, height }: Size) => new Map(
    range(width, 1).map(
        x => range(height, 1).map(
            y => {
                return { x, y };
            },
        ),
    ).flat(1).map(
        position => [getKey(position), position],
    ),
);

const STANDARD_SIZE = { width: 9, height: 9 };

export const EMPTY_GAME: GameSettings = {
    dimensions: STANDARD_SIZE,
    grid: buildGrid(STANDARD_SIZE),
    rules: convertRules(STANDARD_RULES),
};

export interface PortableGame {
    settings: GameSettings;
    givens?: GivenMap;
}

export const loadGameThunk = ({ settings, givens = new Map() }: PortableGame) => (
    (dispatch: AppDispatch) => {
        dispatch(gameActions.load(settings));
        dispatch(inputActions.givens({ givens, grid: new Set(settings.grid.keys()) }));
    }
);

const ENCODING: CompressedEncoding = "Base64";

export const compress = (game: PortableGame) => {
    const data = JSON.stringify(serialize(game));
    return lzutf8.compress(data, { outputEncoding: ENCODING, inputEncoding: "String" });
};

export const decompress = (data: string): PortableGame|undefined => {
    const json = lzutf8.decompress(data, { inputEncoding: ENCODING, outputEncoding: "String" });
    try {
        return deserialize<PortableGame>(JSON.parse(json));
    } catch (error) {
        return undefined;
    }
};
