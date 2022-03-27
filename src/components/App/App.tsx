import "./App.css";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";
import { InputProvider } from "../../context/Input";
import { SelectionProvider } from "../../context/Selection";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Sudoku</h1>
                <ValidationProvider>
                    <InputProvider>
                        <SelectionProvider>
                            <Sudoku></Sudoku>
                        </SelectionProvider>
                    </InputProvider>
                </ValidationProvider>
            </header>
        </div>
    );
}

export default App;
