import { FC } from 'react';
import ThemeSelector from "./ThemeSelector";

export const TopBar: FC = () => {
  return (
    <div id="topbar" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ThemeSelector />
    </div>
    
  );
};

export default TopBar;
