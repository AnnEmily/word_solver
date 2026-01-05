import { type FC } from "react";
import clsx from "clsx";
import { styled } from "@mui/material";

import './Solver.css';
import { useTheme } from "./shared/theme/useTheme";
import { Keyboard, SettingsPanel, TopBar } from "./components";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '8px',
});

export const Solver: FC = () => {
  const { theme } = useTheme();
  const className = clsx(theme)

  return (
    <Container id="solver" className={className}>
      <TopBar />
      <SettingsPanel />
      <Keyboard />
    </Container>
  );
};

export default Solver;