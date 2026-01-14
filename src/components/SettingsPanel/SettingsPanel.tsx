import { FC, useMemo, useState } from "react";
import { useShallow } from 'zustand/shallow';
import { Checkbox, FormControlLabel } from "@mui/material"

import { Panel } from "../../shared/components";
import { useSolverStore } from "../../shared/store";
import { GameColors, LanguageName } from "../../shared/types";
import { availableWordLengths, games } from "../../shared/constants";
import { languageCodeToName, languageNameToCode } from "../../shared/utilsString";

import { SettingSelector } from "./SettingSelector";
import { getArrayOptions, getColorOptions, getGameOptions } from "./utils";

export const SettingsPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [provider, setProvider] = useState<string>(null);
  const [openGameOnSelection, setOpenGameOnSelection] = useState<boolean>(false);

  // States to/from the store
  const [languageCode, setLanguageCode] = useSolverStore(useShallow(state => [state.languageCode, state.setLanguageCode]));
  const [wordLength, setWordLength] = useSolverStore(useShallow(state => [state.wordLength, state.setWordLength]));
  const [colorSet, setColorSet] = useSolverStore(useShallow(state => [state.colorSet, state.setColorSet]));
  const resetSolver = useSolverStore(state => state.resetSolver);

  const options = useMemo(()=> ({
    provider: getGameOptions('name'),
    languageName: getGameOptions('languageCode'),
    wordLength: getArrayOptions(availableWordLengths),
    colors: getColorOptions(),
  }), []);

  const handleChangeProvider = (val: string) => {
    setProvider(val);
    const gameProvider = games.find(g => g.name === val);
  
    if (gameProvider) {
      setColorSet(gameProvider.colorSet ?? colorSet);
      setWordLength(gameProvider.wordLength ?? wordLength);
      setLanguageCode(gameProvider.languageCode ?? languageCode);

      if (openGameOnSelection) {
        const url = `${gameProvider.link.toLowerCase().replace(/ /g, '')}`;
        window.open(url, '_blank');
      }
    }
  };

  const handleChangeWordLength = (len: number) => {
    const prevLanguageCode = languageCode;
    resetSolver();
    setWordLength(len);
    setLanguageCode(prevLanguageCode);
  };
  
  return (
    <Panel id="settings-panel" title={"Game settings"} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
      <div className="controls">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <SettingSelector
            id="provider"
            label="Game"
            value={provider}
            options={options.provider}
            onSelect={handleChangeProvider}
          />
          <FormControlLabel control={
            <Checkbox sx={{ color: '#7e7e7e' }} onChange={() => setOpenGameOnSelection(!openGameOnSelection)} />
          } label="Open game on selection" />
        </div>

        <SettingSelector
          id="dictionary"
          label="Language"
          value={languageCodeToName(languageCode)}
          options={options.languageName}
          onSelect={val => setLanguageCode(languageNameToCode(val as LanguageName) )}
        />
        <SettingSelector
          id="word-length"
          label="Word Length"
          value={wordLength?.toString() ?? ''}
          options={options.wordLength}
          onSelect={val => handleChangeWordLength(Number(val))}
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
