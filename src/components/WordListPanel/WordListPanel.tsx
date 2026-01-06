import { FC, useEffect, useMemo, useState } from "react";
import { useShallow } from 'zustand/shallow';
import { Checkbox, FormControlLabel } from "@mui/material";

const dictionaries = import.meta.glob('../../dico/*/*.js');

import { dedupeIgnoringDiacriticsAndCase , filterDuplicatedLetters, removeWordsWithCapitals } from "./utils";
import { Panel } from "../../shared/components";
import { useSolverStore } from "../../shared/store";
import { LanguageCode } from "../../shared/types";

export const WordListPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [dedupe, setDedupe] = useState<boolean>(true);
  const [noCapitals, setNoCapitals] = useState<boolean>(true);

  // States from file loading
  const [dictionary, setDictionary] = useState<string[]>([]);

  // States to/from the store
  const languageCode = useSolverStore(useShallow(state => state.languageCode));
  const wordLength = useSolverStore(useShallow(state => state.wordLength));

  const loadDictionary = async (language: LanguageCode, wordLength: number): Promise<any> => {
      // Load words from file. Assuming files are named as XX/YY.js where XX is the language 
      // code and YY is the word length.

      const root = '../../dico';
      const name = `${wordLength.toString().length === 1 ? '0' + wordLength.toString() : wordLength.toString()}`;
      const dictPath = `${root}/${language}/${name}.js`;

      const loader = dictionaries[dictPath];
      
      if (!loader) {
        throw new Error(`Dictionary not found: ${dictPath}`);
      }

      const module = await loader() as { Dictionary: string[] };

      return { dict: module.Dictionary, dictPath };
  }

  useEffect(() => {
    loadDictionary(languageCode, wordLength)
      .then(({ dict, dictPath }) => {
        console.log(`Loaded dictionary from ${dictPath} with ${dict.length} words.`);
        setDictionary(dict);
      });
  }, [languageCode, wordLength]);

  const sortedDict = useMemo(() => {
    return [...dictionary].sort((a,b) => a.localeCompare(b));
  }, [dictionary]);

  const filteredDict = useMemo(() => {
    let filtered = [...sortedDict];

    if (hideDuplicates) {
      filtered = filterDuplicatedLetters(filtered, !hideDuplicates);
    }
    if (dedupe) {
      filtered = dedupeIgnoringDiacriticsAndCase (filtered);
    }
    if (noCapitals) {
      filtered = removeWordsWithCapitals(filtered);
    }
    return filtered;
  }, [sortedDict, hideDuplicates, dedupe, noCapitals]);

  const wordCount = useMemo(() => {
    return filteredDict.length;
  }, [filteredDict]);

  return (
    <Panel id="word-list-panel" title={'Word List'} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
      <div className="controls">
        <div>
          <FormControlLabel 
            label="No duplicated letters"
            control={
              <Checkbox
                checked={hideDuplicates}
                sx={{ color: '#7e7e7e' }}
                onChange={() => setHideDuplicates(!hideDuplicates)}
              />
          } />
          <FormControlLabel 
            label="No capital letters"
            control={
              <Checkbox
                checked={noCapitals}
                sx={{ color: '#7e7e7e' }}
                onChange={() => setNoCapitals(!noCapitals)}
              />
          } />
          <FormControlLabel 
            label="Dedupe similar words"
            control={
              <Checkbox
                checked={dedupe}
                sx={{ color: '#7e7e7e' }}
                onChange={() => setDedupe(!dedupe)}
              />
          } />
        </div>

        <div>{`Word Count: ${wordCount.toLocaleString()}`}</div>
      </div>
      <div className="word-list">
        {filteredDict.join(' - ')}
      </div>
    </Panel>
  );
};

export default WordListPanel;
