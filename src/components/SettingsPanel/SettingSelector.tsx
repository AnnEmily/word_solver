import { JSX, type FC } from "react";
import { Select } from "@mui/material";

import { GameSet } from "../../shared/types";
import { useTheme } from "../../shared/hooks/theme-context";
import clsx from "clsx";

interface SettingSelectorProps {
  id: string;
  label: string;
  gameProvider: GameSet,
  options: JSX.Element[];
  onSelect: (providerId: number) => void;
}

export const SettingSelector: FC<SettingSelectorProps> = ({ id, label, gameProvider, options, onSelect }) => {
  const { theme } = useTheme();
  const className = clsx("game-setting", theme)

  return (
    <div id={id} className={className} style={{ minWidth: '175px' }}>
      <div className="label">{label}</div>
      <Select value={gameProvider?.id} onChange={(e) => onSelect(Number(e.target.value))}>
        {options}
      </Select>
    </div>
    
  );
};

export default SettingSelector;
