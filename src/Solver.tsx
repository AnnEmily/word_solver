import { type FC } from "react";
import clsx from "clsx";
import { styled } from "@mui/material";

import './Solver.css';
import { useTheme } from "./shared/theme/useTheme";
import { Keyboard, SettingsPanel, TopBar } from "./components";
import { useSolverStore } from "./shared/store";
import { useShallow } from "zustand/shallow";
import WordListPanel from "./components/WordListPanel/WordListPanel";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '8px',
});

export const Solver: FC = () => {
  // States to/from the store
  const language = useSolverStore(useShallow(state => state.language));
  const wordLength = useSolverStore(useShallow(state => state.wordLength));
    
  const { theme } = useTheme();
  const className = clsx(theme)

  return (
    <Container id="solver" className={className}>
      <TopBar />
      <SettingsPanel />
      <Keyboard />
      {language && wordLength && <WordListPanel />}
    </Container>
  );
};

export default Solver;