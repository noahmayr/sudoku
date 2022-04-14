import { Fab } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MouseEventHandler, useEffect, useState } from "react";
import games from "../../state/global/games";
import useGame from "../../hooks/useGame";

type GameName = keyof typeof games;


const getRandomGame = (names: GameName[]): GameName => (
    names[Math.floor(Math.random() * names.length)]
);

const gameNames = Object.keys(games) as GameName[];

const ReloadGameFab = () => {
    const [currentGame, setCurrentGame] = useState(getRandomGame(gameNames));
    const { loadGame, resetGame: reloadGame } = useGame();

    useEffect(() => {
        loadGame(games[currentGame]);
    }, [currentGame]);

    const onClick: MouseEventHandler<unknown> = (event) => {
        if (event.shiftKey) {
            const nextGame = getRandomGame(gameNames.filter(name => name !== currentGame));
            setCurrentGame(nextGame);
        }
        reloadGame();
    };

    return (
        <Fab color="primary" size="large" onClick={onClick}><RefreshIcon fontSize="large" /></Fab>
    );
};

export default ReloadGameFab;
