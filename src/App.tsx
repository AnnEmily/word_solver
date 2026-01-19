import { SnackbarProvider } from 'notistack';

import { ThemeProvider } from './shared/theme/ThemeProvider';
import Solver from "./Solver";
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Solver />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

