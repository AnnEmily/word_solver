import { FC, useMemo, useState } from "react";

import { getArrayOptions, getGameOptions } from "./utils";
import { SettingSelector } from "./SettingSelector";
import { Panel } from "../../shared/components/Panel";
import { GameColors, GameLanguage } from "../../shared/types";
import { availableWordLengths, games } from "../../shared/constants";

export const SettingsPanel: FC = () => {
  const [provider, setProvider] = useState<string>(null);
  const [language, setLanguage] = useState<GameLanguage>(null);
  const [wordLength, setWordLength] = useState<number>(null);
  const [colorSet, setColorSet] = useState<GameColors>(null);

  const options = useMemo(()=> {
    return ({
      provider: getGameOptions('name'),
      language: getGameOptions('language'),
      wordLength: getArrayOptions(availableWordLengths),
      colors: getGameOptions('colorSet'),
    });
  }, []);

  const handleChangeProvider = (val: string) => {
    setProvider(val);
    const gameProvider = games.find(g => g.name === val);
    if (gameProvider) {
      setColorSet(gameProvider.colorSet ?? colorSet);
      setWordLength(gameProvider.wordLength ?? wordLength);
      setLanguage(gameProvider.language ?? language);
    }
  };

  return (
    <Panel id="settings-panel" title={"Settings"}>
      <div className="controls">
        <SettingSelector
          id="provider"
          label="Game"
          value={provider}
          options={options.provider}
          onSelect={handleChangeProvider}
        />
        <SettingSelector
          id="dictionary"
          label="Language"
          value={language}
          options={options.language}
          onSelect={val => setLanguage(val as GameLanguage)}
        />
        <SettingSelector
          id="word-length"
          label="Word Length"
          value={wordLength?.toString() ?? ''}
          options={options.wordLength}
          onSelect={val => setWordLength(Number(val))}
        />
        <SettingSelector
          id="colors"
          label="Color Set"
          value={colorSet}
          options={options.colors}
          onSelect={val => setColorSet(val as GameColors)}
        />
      </div>
      
    </Panel>
  );
};

export default SettingsPanel;
