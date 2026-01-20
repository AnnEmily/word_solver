import { FC, useState } from 'react';
import { IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';

import _ThemeSelector from "./ThemeSelector";
import { HelpDialog } from '../HelpDialog';

export const TopBar: FC = () => {
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
    <div id="topbar">
      <div style={{ width: '20px' }} />
      <div>{"WORD SOLVER"}</div>
      {/* <ThemeSelector /> */}
      <IconButton aria-label="help" onClick={() => setOpenHelp(true)}>
        <HelpIcon style={{ color: 'white' }}/>
      </IconButton>

      {openHelp && (
        <HelpDialog onClose={() => setOpenHelp(false)}/>
      )}
    </div>
    
  );
};

export default TopBar;
