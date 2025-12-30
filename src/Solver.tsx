import { useMemo, useState, type FC } from "react";
import { TopBar } from "./components/TopBar";
import { styled } from "@mui/material";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import { useTheme } from "./shared/hooks/theme-context";
import clsx from "clsx";
import './Solver.css';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '8px',
});

export const Solver: FC<{}> = ({}) => {
  const { theme } = useTheme();
  const className = clsx(theme)

  return (
    <Container id="solver" className={className}>
      <TopBar />
      <SettingsPanel />
    </Container>
  );
};

export default Solver;