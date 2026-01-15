import { FC } from "react";
import clsx from "clsx";
import { FormControl, Select } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import { JSX } from "@emotion/react/jsx-runtime";

interface SettingSelectorProps {
  id: string;
  label: string;
  value: string;
  options: JSX.Element[];
  required?: boolean;
  missingOptions?: boolean;
  onSelect: (_value: string) => void;
}

export const SettingSelector: FC<SettingSelectorProps> = ({ id, label, value, options, required = true, missingOptions = true, onSelect }) => {
  const { theme } = useTheme();
  
  const emptyError = missingOptions && required && (!value || value === '0');
  const containerClass = clsx("game-setting", theme);
  const selectorClass = clsx(emptyError && "hasError");
  const labelClass = clsx("label", required && "required");
  
  return (
    <div id={id} className={containerClass} style={{ minWidth: '230px' }}>
      <div className={labelClass}>{label}</div>
      <FormControl required={required}>
        <Select
          name={`select-${id}`}
          value={value}
          onChange={e => onSelect(e.target.value)}
          className={selectorClass}
        >
          {options}
        </Select>
      </FormControl>

      <div className="error-helper">{emptyError ? "Field is required" : ""}</div>
    </div>
    
  );
};

export default SettingSelector;
