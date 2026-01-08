import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useShallow } from 'zustand/shallow';

const dictionaries = import.meta.glob('../../dico/*/*.js');

import { OptionCheckbox } from "./OptionCheckbox";
import { dedupeIgnoringDiacriticsAndCase , filterDuplicatedLetters, removeWordsWithCapitals } from "./utils";
import { Panel } from "../../shared/components";
import { useSolverStore } from "../../shared/solverStore";
import { LanguageCode } from "../../shared/types";

export const WordListPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(false);
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
    if (languageCode && wordLength) {
      loadDictionary(languageCode, wordLength)
        .then(({ dict, dictPath }) => {
          console.log(`Loaded dictionary from ${dictPath} with ${dict.length} words.`);
          setDictionary(dict);
      });
    }
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

  const title = useMemo(() => {
    return `${wordCount.toLocaleString()} words`;
  }, [wordCount]);
  
  const canDisplayWordList = languageCode && wordLength !== 0;

  return (
    <Fragment>
      {canDisplayWordList && (
        <Panel id="word-list-panel" title={title} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
          <div className="controls">
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <OptionCheckbox
                label="No duplicated letters"
                checked={hideDuplicates}
                onToggle={() => setHideDuplicates(!hideDuplicates)}
              />
              <OptionCheckbox
                label="No capital letters"
                checked={noCapitals}
                onToggle={() => setNoCapitals(!noCapitals)}
              />
              <OptionCheckbox
                label="Dedupe similar words"
                checked={dedupe}
                onToggle={() => setDedupe(!dedupe)}
              />
            </div>
          </div>

          <div className="word-list">
            {filteredDict.join(' - ')}
          </div>
        </Panel>
      )}

      {!canDisplayWordList && (
        <div className="msg warning">{"You need to select both a language and a word length to view the word list"}</div>
      )}
    </Fragment>
  );
};

export default WordListPanel;
