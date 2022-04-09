import { EASY_GAME, HARD_GAME } from "./compressedGames/regular";
import { SAMURAI_SUDOKU } from "./compressedGames/samurai";
import { convertGame } from "./compressedGames/util";
import { compress } from "./load";

export default {
    hard: compress(convertGame(HARD_GAME)),
    easy: compress(convertGame(EASY_GAME)),
    samurai: compress(convertGame(SAMURAI_SUDOKU)),
};
