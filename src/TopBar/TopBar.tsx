import { FC } from 'react';
import ThemeSelector from "./ThemeSelector";
import { styled } from '@mui/material';

const Bar = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

interface TopBarProps {
  darkTheme: boolean,
  onToggleTheme: () => void,
}

export const TopBar: FC<TopBarProps> = ({ darkTheme, onToggleTheme }) => {
  return (
    <Bar id="topbar">
      <ThemeSelector darkTheme={darkTheme} onToggle={onToggleTheme}/>
    </Bar>
    
  );
};

export default TopBar;
