import cls from "classnames";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";
import classes from "./App.module.scss";

function App() {
    return (
        <div className={cls(classes.root, classes.lightTheme)}>
            <ValidationProvider>
                <Sudoku></Sudoku>
            </ValidationProvider>
        </div>
    );
}

export default App;
