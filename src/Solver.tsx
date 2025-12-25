import { useState, type FC } from "react";
import { TopBar } from "./TopBar";
import { styled } from "@mui/material";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
});

export const Solver: FC<{}> = ({}) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  return (
    <Container>
      <TopBar darkTheme={darkTheme} onToggleTheme={() => setDarkTheme(!darkTheme)}/>
    </Container>
  );
};

export default Solver;