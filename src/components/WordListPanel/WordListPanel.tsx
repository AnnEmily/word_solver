import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useShallow } from 'zustand/shallow';

const dictionaries = import.meta.glob('../../dico/*/*.js');

import { OptionCheckbox } from "./OptionCheckbox";
import { buildRegexFromCandidates, dedupeIgnoringDiacriticsAndCase, filterDuplicatedLetters, removeWordsWithCapitals } from "./utils";
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
  const { candidateLetters, languageCode, mustInclude, setWord, wordConfirmed, wordLength } = useSolverStore(useShallow(state => ({
    candidateLetters: state.candidateLetters,
    languageCode: state.languageCode,
    mustInclude: state.mustInclude,
    setWord: state.setWord,
    wordConfirmed: state.wordConfirmed,
    wordLength: state.wordLength,
  })))

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

  const handleWordDoubleClick = (word: string) => {
    if (!wordConfirmed) {
      setWord(word.split('').map(letter => ({ symbol: letter.toUpperCase(), status: null })));
    }
  };

  const sortedDict = useMemo((): string[] => {
    return [...dictionary].sort((a,b) => a.localeCompare(b));
  }, [dictionary]);

  const filteredDict = useMemo((): string[] => {
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

  const candidateWords = useMemo((): string[] => {
    if (wordLength === 0 || candidateLetters.length === 0 || filteredDict.length == 0) {
      return [];
    }

    const regex = buildRegexFromCandidates(wordLength, candidateLetters, [...mustInclude]);
    console.log({ candidateLetters, mustInclude, regex: regex.source }); // AEG
    const matches = filteredDict.filter(word => regex.test(word.toUpperCase()));

    return matches;
  }, [filteredDict, candidateLetters, mustInclude, wordLength]);

  const wordCount = candidateWords.length;
  const title = `${wordCount.toLocaleString()} words`; 
  const canDisplayWordList = languageCode && wordLength !== 0;

  return (
    <Fragment>
      {canDisplayWordList && (
        <Panel id="word-list-panel" title={title} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
          {hideDuplicates && mustInclude.size > 0 && (
            <div className="msg" style={{ alignItems: 'flex-start', marginTop: '15px' }}>
              <div className="warning">{"The 'No duplicated letter' filter is active - so the word you try to guess might not be listed below"}</div>
            </div>
          )}

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
            {candidateWords.map((word, index) => (
              <span
                key={index}
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => handleWordDoubleClick(word)}
              >
                {word}
                {/* Add separator after all but the last word */}
                {index < candidateWords.length - 1 && ' - '}
              </span>
            ))}
          </div>
        </Panel>
      )}

      {!canDisplayWordList && (
        <div className="msg">
          <div className="warning">{"You need to select both a language and a word length to view the word list"}</div>
        </div>
      )}
    </Fragment>
  );
};

export default WordListPanel;
