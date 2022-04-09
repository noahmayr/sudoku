import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ColorNames, EMPTY_GAME } from "../state/slice/game";
import { CellValue } from "../state/slice/input";
import { decompress, loadGameThunk } from "../state/global/load";

export type GameGivens = (CellValue | undefined)[][];
export type GameRegion = (true | undefined)[][];

type ColoredRegions = {
    [key in ColorNames]?: GameRegion;
}

export interface GameRules {
    regions?: GameRegion[];
    rows?: Point[];
    columns?: Point[];
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

const currentUrl = () => new URL(window.location.href);

const useGame = (fallback: string) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const url = currentUrl();
        const data = url.searchParams.get("game") ?? fallback;
        const game = decompress(data);
        if (game === undefined) {
            dispatch(loadGameThunk({ board: EMPTY_GAME }));
            return;
        }
        dispatch(loadGameThunk(game));
    }, []);
};

export default useGame;
