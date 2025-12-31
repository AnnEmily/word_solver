import { FC } from "react";
import clsx from "clsx";
import { MenuItem, Select } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { JSX } from "@emotion/react/jsx-runtime";

interface SettingSelectorProps {
  id: string;
  label: string;
  value: string;
  options: JSX.Element[];
  onSelect: (_value: string) => void;
}

export const SettingSelector: FC<SettingSelectorProps> = ({ id, label, value, options, onSelect }) => {
  const { theme } = useTheme();
  const className = clsx("game-setting", theme)

  return (
    <div id={id} className={className} style={{ minWidth: '230px' }}>
      <div className="label">{label}</div>
      <Select name={`select-${id}`} value={value} onChange={e => onSelect(e.target.value)}>
        {options}
      </Select>
    </div>
    
  );
};

export default SettingSelector;
