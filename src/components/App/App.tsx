import logo from './logo.svg';
import './App.css';
import Grid from '../Grid/Grid';
import { ValidationProvider } from '../../context/Validation';
import { InputProvider } from '../../context/Input';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sudoku</h1>
        <ValidationProvider>
          <InputProvider>
            <Grid></Grid>
          </InputProvider>
        </ValidationProvider>
      </header>
    </div>
  );
}

export default App;
