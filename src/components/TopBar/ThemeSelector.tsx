import type { FC } from "react";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkModeTwoTone";
import LightModeIcon from "@mui/icons-material/LightModeTwoTone";

import { useTheme } from "../../shared/hooks/theme-context";

interface ThemeSelectorProps {}

const ThemeSelector: FC<ThemeSelectorProps> = ({}) => {
  const { theme, setTheme} = useTheme();

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <IconButton sx={{ '&:focus': { outline: 'none' }}} onClick={handleToggleTheme}>
      {theme === 'dark' ? <DarkModeIcon sx={{ color: 'white' }} />: <LightModeIcon sx={{ color: 'black' }} />}
    </IconButton>
  );
}

export default ThemeSelector;