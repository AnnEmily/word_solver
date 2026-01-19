import { FC, useState } from "react";

import { Panel } from "../../shared/components";
import { Grid, Keyboard } from "../../components";

export const GridPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  return (
    <Panel id="grid-keyboard-panel" title={"Game board"} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
      <Grid />
      <Keyboard />
    </Panel>
  );
};

export default GridPanel;
