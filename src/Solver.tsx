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
  const languageCode = useSolverStore(useShallow(state => state.languageCode));
  const wordLength = useSolverStore(useShallow(state => state.wordLength));
    
  const { theme } = useTheme();
  const className = clsx(theme)

  return (
    <Container id="solver" className={className}>
      <TopBar />
      <SettingsPanel />
      <Keyboard />
      {languageCode && wordLength !== 0 && <WordListPanel />}
    </Container>
  );
};

export default Solver;