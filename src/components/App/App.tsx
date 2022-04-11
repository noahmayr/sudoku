import cls from "classnames";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";
import classes from "./App.module.scss";
import Sidebar from "../Sidebar/Sidebar";
import { selectSettings } from "../../state/slice/settings";

type ThemeClass<T extends string> = `${T}Theme`;

function App() {
    const theme = useSelector(createSelector(selectSettings, state => state.theme));
    const themeClass: ThemeClass<typeof theme> = `${theme}Theme`;
    return (
        <div className={cls(classes.root, classes[themeClass])}>
            <ValidationProvider>
                <Sidebar />
                <Sudoku></Sudoku>
            </ValidationProvider>
        </div>
    );
}

export default App;
