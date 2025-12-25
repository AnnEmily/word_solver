import type { FC } from "react";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkModeTwoTone";
import LightModeIcon from "@mui/icons-material/LightModeTwoTone";

interface ThemeSelectorProps {
  darkTheme: boolean,
  onToggle: () => void,
}

const ThemeSelector: FC<ThemeSelectorProps> = ({ darkTheme, onToggle }) => {
  return (
    <IconButton sx={{ '&:focus': { outline: 'none' }}} onClick={onToggle}>
      {darkTheme ? <DarkModeIcon sx={{ color: 'white' }} />: <LightModeIcon sx={{ color: 'black' }} />}
    </IconButton>
  );
}

export default ThemeSelector;