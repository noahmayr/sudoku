import "./App.css";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Sudoku</h1>
                <ValidationProvider>
                    <Sudoku></Sudoku>
                </ValidationProvider>
            </header>
        </div>
    );
}

export default App;
