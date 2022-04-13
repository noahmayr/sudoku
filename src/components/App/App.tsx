import cls from "classnames";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";
import classes from "./App.module.scss";
import FabContainer from "../Fab/FabContainer";
import { selectSettings } from "../../state/slice/settings";

type ThemeClass<T extends string> = `${T}Theme`;

const getTheme = (mode: "dark"|"light") => createTheme({ palette: { mode } });

function App() {
    const theme = useSelector(createSelector(selectSettings, state => state.theme));
    const themeClass: ThemeClass<typeof theme> = `${theme}Theme`;
    const muiTheme = useMemo(() => createTheme(getTheme(theme)), [theme]);

    return (
        <ThemeProvider theme={muiTheme}>
            <div className={cls(classes.root, classes[themeClass])}>
                <ValidationProvider>
                    <Sudoku></Sudoku>
                    <FabContainer />
                </ValidationProvider>
            </div>
        </ThemeProvider>
    );
}

export default App;
