import { FC } from 'react';
import ThemeSelector from "./ThemeSelector";
import { styled } from '@mui/material';

const Bar = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

interface TopBarProps {}

export const TopBar: FC<TopBarProps> = ({}) => {
  return (
    <Bar id="topbar">
      <ThemeSelector />
    </Bar>
    
  );
};

export default TopBar;
