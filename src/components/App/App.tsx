import "./App.css";
import Sudoku from "../Sudoku/Sudoku";
import { ValidationProvider } from "../../context/Validation";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <ValidationProvider>
                    <Sudoku></Sudoku>
                </ValidationProvider>
            </header>
        </div>
    );
}

export default App;
