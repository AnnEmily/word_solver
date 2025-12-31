import { FC, useMemo, useState } from "react";
import { uniq } from "lodash";

import { SettingSelector } from "./SettingSelector";
import { Panel } from "../../shared/components/Panel";
import { GameColors, GameLanguage } from "../../shared/types";
import { availableWordLengths, games } from "../../shared/constants";

export const SettingsPanel: FC = () => {
  const [provider, setProvider] = useState<string>(null);
  const [language, setLanguage] = useState<GameLanguage>(null);
  const [wordLength, setWordLength] = useState<number>(null);
  const [colors, setColors] = useState<GameColors>(null);

  const getGameOptions = (field: string) => {
    return uniq(games.map(g => g[field].toString())).sort();
  };

  const getArrayOptions = (src: number[]) => {
    return uniq(src).map(v => v.toString()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  };

  const options = useMemo(()=> {
    // TODO : make sure field names exist
    return ({
      provider: getGameOptions('name'),
      language: getGameOptions('language'),
      wordLength: getArrayOptions(availableWordLengths),
      colors: getGameOptions('colors'),
    });
  }, []);

  const handleChangeProvider = (val: string) => {
    setProvider(val);
    const gameProvider = games.find(g => g.name === val);
    if (gameProvider) {
      setColors(gameProvider.colors ?? colors);
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
          value={colors}
          options={options.colors}
          onSelect={val => setColors(val as GameColors)}
        />
      </div>
      
    </Panel>
  );
};

export default SettingsPanel;
