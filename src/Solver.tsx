import { type FC } from "react";
import clsx from "clsx";

import { useTheme } from "./shared/theme/useTheme";

import { Grid, Keyboard, SettingsPanel, TopBar, WordListPanel } from "./components";
import './Solver.css';

export const Solver: FC = () => {
  const { theme } = useTheme();
  const className = clsx('solver', theme)

  return (
    <div id="solver" className={className}>
      <TopBar />
      <SettingsPanel />
      <Grid />
      <Keyboard />
      <WordListPanel />
    </div>
  );
};

export default Solver;