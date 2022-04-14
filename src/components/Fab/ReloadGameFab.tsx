import { Fab } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import games from "../../state/global/games";
import useGame from "../../hooks/useGame";
import { selectGame } from "../../state/slice/game";

type GameName = keyof typeof games;


const getRandomGame = (names: GameName[]): GameName => (
    names[Math.floor(Math.random() * names.length)]
);

const GAME_NAMES = Object.keys(games) as GameName[];

const getNameWithout = (current?: string) => (
    getRandomGame(GAME_NAMES.filter(name => name !== current))
);

const ReloadGameFab = () => {
    const loadedGame = useSelector(selectGame.game);
    const [currentGame, setCurrentGame] = useState<GameName>();
    const { loadGame, resetGame: reloadGame } = useGame();

    useEffect(() => {
        if (currentGame === undefined) {
            return;
        }
        loadGame(games[currentGame]);
    }, [loadGame, currentGame]);

    useEffect(() => {
        if (loadedGame === undefined) {
            setCurrentGame(getNameWithout(currentGame));
        }
    }, [loadedGame]);

    const onClick: MouseEventHandler<unknown> = (event) => {
        if (event.shiftKey) {
            setCurrentGame(getNameWithout(currentGame));
        }
        reloadGame();
    };

    return (
        <Fab color="primary" size="large" onClick={onClick}><RefreshIcon fontSize="large" /></Fab>
    );
};

export default ReloadGameFab;
