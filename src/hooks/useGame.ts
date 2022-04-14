import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ColorNames, EMPTY_GAME } from "../state/slice/game";
import { CellValue, inputActions } from "../state/slice/input";
import { decompress, loadGameThunk } from "../state/global/load";
import { useAppSelector } from "../state/store";

export type GameGivens = (CellValue | undefined)[][];
export type GameRegion = (true | undefined)[][];

type ColoredRegions = {
    [key in ColorNames]?: GameRegion;
}

export interface GameRules {
    regions?: GameRegion[];
    rows?: Position[];
    columns?: Position[];
}

export interface GameExtras {
    coloredRegions: ColoredRegions;
}

export interface MinifiedGame {
    width?: number;
    height?: number;
    cells?: GameGivens;
    rules?: GameRules;
    extra?: GameExtras;
}

const useGame = () => {
    const dispatch = useDispatch();

    const loadGame = useCallback((compressed: string) => {
        const newGame = decompress(compressed);
        if (newGame === undefined) {
            dispatch(loadGameThunk({ board: EMPTY_GAME }));
            return;
        }
        dispatch(loadGameThunk(newGame));
    }, [dispatch]);

    const resetGame = useCallback(() => {
        dispatch(inputActions.clear());
    }, [dispatch]);

    return { loadGame, resetGame };
};

export default useGame;
