import { FC } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

interface OptionCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export const OptionCheckbox: FC<OptionCheckboxProps> = ({ label, checked, onToggle }) => {
  // const { theme } = useTheme();
  // const className = clsx("game-setting", theme)

  return (
    <FormControlLabel 
      label={label}
      control={
        <Checkbox
          checked={checked}
          sx={{ color: '#7e7e7e' }}
          onChange={onToggle}
        />
    } />    
  );
};

export default OptionCheckbox;
