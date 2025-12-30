import { useMemo, useState, type FC } from "react";
import { MenuItem, styled } from "@mui/material";

import { SettingSelector } from "./SettingSelector";
import { GameSet } from "../../shared/types";
import { Panel } from "../../shared/components/Panel";
import { games } from "../../shared/constants";

const Controls = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '24px',
});

export const SettingsPanel: FC<{}> = ({}) => {
  const [gameProvider, setGameProvider] = useState<GameSet>(null);

  const getOptions = (field: string) => (
    games.map(g => (
      <MenuItem key={g.id} value={g.id}>
        {g[field]}
      </MenuItem>
    ))
  );

  const options = useMemo(()=> {
    return ({
      provider: getOptions('provider'),
      language: getOptions('language'),
      wordLength: getOptions('wordLength'),
      colors: getOptions('colors'),
    });
  }, [games]);

  return (
    <Panel id="settings-panel" title={"Settings"}>
      <Controls>
        <SettingSelector
          id="provider"
          label="Game"
          gameProvider={gameProvider}
          options={options.provider}
          onSelect={() => null}
        />
        <SettingSelector
          id="dictionary"
          label="Dictionary"
          gameProvider={gameProvider}
          options={options.language}
          onSelect={() => null}
        />
        <SettingSelector
          id="word-length"
          label="Word Length"
          gameProvider={gameProvider}
          options={options.wordLength}
          onSelect={() => null}
        />
        <SettingSelector
          id="colors"
          label="Color Set"
          gameProvider={gameProvider}
          options={options.colors}
          onSelect={() => null}
        />
      </Controls>
      
    </Panel>
  );
};

export default SettingsPanel;
