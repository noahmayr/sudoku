import lzutf8, { CompressedEncoding } from "lzutf8";
import { serialize, deserialize } from "superjson";
import { gameActions, GameBoard } from "../slice/game";
import { inputActions, GivenMap } from "../slice/input";
import { AppDispatch } from "../store";

export interface PortableGame {
    board: GameBoard;
    givens?: GivenMap;
}

export const loadGameThunk = ({ board, givens = new Map() }: PortableGame) => (
    (dispatch: AppDispatch) => {
        dispatch(gameActions.load(board));
        dispatch(inputActions.givens(givens));
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
        const game = deserialize<PortableGame>(JSON.parse(json));
        if (game.board === undefined) {
            throw Error("Failed to load game");
        }
        return game;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return undefined;
    }
};
