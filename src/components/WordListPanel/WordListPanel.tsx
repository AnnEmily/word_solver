import { FC, useState } from "react";
import { useShallow } from 'zustand/shallow';

import { Panel } from "../../shared/components";
import { useSolverStore } from "../../shared/store";

export const WordListPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // States to/from children

  // States to/from the store
  const language = useSolverStore(useShallow(state => state.language));
  const wordLength = useSolverStore(useShallow(state => state.wordLength));

  return (
    <Panel id="word-list-panel" title={"Word List"} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
      <div className="controls">
        {'Checkbox and other controls for word list panel can go here'}        
      </div>

    </Panel>
  );
};

export default WordListPanel;
