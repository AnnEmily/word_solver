import { FC } from 'react';
import ThemeSelector from "./ThemeSelector";

interface TopBarProps {
  darkTheme: boolean,
  onToggleTheme: () => void,
}

export const TopBar: FC<TopBarProps> = ({ darkTheme, onToggleTheme }) => {
  return (<ThemeSelector darkTheme={darkTheme} onToggle={onToggleTheme}/>);
};

export default TopBar;
