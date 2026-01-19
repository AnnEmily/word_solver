import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { useShallow } from 'zustand/shallow';
import { useSnackbar } from "notistack";
import clsx from "clsx";

import { OptionCheckbox } from "./OptionCheckbox";
import { buildRegexFromCandidates, dedupeIgnoringDiacriticsAndCase, filterDuplicatedLetters, removeWordsWithCapitals } from "./utils";
import { useSolverStore } from "../../shared/store";
import { LanguageCode } from "../../shared/types";
import { Zoom } from "@mui/material";

const dictionaries = import.meta.glob('../../dico/*/*.js');

export const WordListPanel: FC = () => {
  const [ref, inView] = useInView({ threshold: 0 });
  const { enqueueSnackbar } = useSnackbar();

  // States for inner control
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [dedupe, setDedupe] = useState<boolean>(true);
  const [noCapitals, _setNoCapitals] = useState<boolean>(true);

  // States to/from the store
  const { candidateLetters, languageCode, mustInclude, setWord, wordConfirmed, wordLength, setWordListInView } = useSolverStore(useShallow(state => ({
    candidateLetters: state.candidateLetters,
    languageCode: state.languageCode,
    mustInclude: state.mustInclude,
    setWord: state.setWord,
    wordConfirmed: state.wordConfirmed,
    wordLength: state.wordLength,
    setWordListInView: state.setWordListInView,
  })));

  // States from file loading
  const [dictionary, setDictionary] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string>(null);

  useEffect(() => {
    if (languageCode && wordLength) {

    const loadDictionary = async (language: LanguageCode, wordLength: number): Promise<any> => {
      // Load words from file. Assuming files are named as XX/YY.js where XX is the language
      // code and YY is the word length.

      setIsLoading(true);

      const root = '../../dico';
      const name = `${wordLength.toString().length === 1 ? '0' + wordLength.toString() : wordLength.toString()}`;
      const dictPath = `${root}/${language}/${name}.js`;

      const loader = dictionaries[dictPath];
      
      if (!loader) {
        throw new Error(`Dictionary not found: ${dictPath}`);
      }

      const module = await loader() as { Dictionary: string[] };

      return { dict: module.Dictionary, dictPath };
    };

    loadDictionary(languageCode, wordLength)
      .then(({ dict, dictPath }) => {
        console.log(`Loaded dictionary from ${dictPath} with ${dict.length} words.`);
        setDictionary(dict);
      })
      .catch(err => setLoadingError(err))
      .finally(() => setIsLoading(false));
    }
  }, [languageCode, wordLength]);

  useEffect(() => {
    setWordListInView(inView);
  }, [inView, setWordListInView]);

  const handleWordClick = (word: string) => {
    if (!wordConfirmed) {
      setWord(word.split('').map(letter => ({
        // Make sure to remove diacritics that are present in the words list
        symbol: letter.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        status: null,
      })));
      enqueueSnackbar('Word copied to the grid', {
        autoHideDuration: 2000,
        TransitionComponent: Zoom,
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        variant: 'success',
      });
    }
  };

  const sortedDict = useMemo((): string[] => {
    return dictionary ? [...dictionary].sort((a,b) => a.localeCompare(b)) : null;
  }, [dictionary]);

  const filteredDict = useMemo((): string[] => {
    if (sortedDict) {
      let filtered = [...sortedDict];

      if (hideDuplicates) {
        filtered = filterDuplicatedLetters(filtered, !hideDuplicates);
      }
      if (dedupe) {
        filtered = dedupeIgnoringDiacriticsAndCase(filtered);
      }
      if (noCapitals) {
        filtered = removeWordsWithCapitals(filtered);
      }
      return filtered;
    }
    
    return [];
  }, [sortedDict, hideDuplicates, dedupe, noCapitals]);

  const candidateWords = useMemo((): string[] => {
    if (wordLength > 0 && candidateLetters.length > 0 && filteredDict.length > 0) {
      const regex = buildRegexFromCandidates(wordLength, candidateLetters, [...mustInclude]);
      return filteredDict.filter(word => regex.test(word.toUpperCase()));
    } else {
      return [];
    }
  }, [filteredDict, candidateLetters, mustInclude, wordLength]);

  const wordCount = candidateWords.length;
  const title = `Candidate words (${wordCount.toLocaleString()})`;
  const canDisplayWordList = languageCode && wordLength !== 0 && !isLoading && !loadingError;

  return (
    <>
      {canDisplayWordList && (
        <div id="word-list-panel" style={{ border: '2px solid white', flexGrow: '.92' }}>
          <div className="panel-title" style={{ marginBottom: '12px' }}>{title}</div>

          {hideDuplicates && mustInclude.size > 0 && (
            <div className="msg" style={{ alignItems: 'flex-start', height: '20px' }}>
              <div className="warning">{"The 'No repeated letter' filter is active - so the word you try to guess might not be listed below"}</div>
            </div>
          )}

          <div className="controls">
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <OptionCheckbox
                label="No repeated letters"
                checked={hideDuplicates}
                onToggle={() => setHideDuplicates(!hideDuplicates)}
              />
              {/* <OptionCheckbox
                label="No capital letters"
                checked={noCapitals}
                onToggle={() => setNoCapitals(!noCapitals)}
              /> */}
              <OptionCheckbox
                label="No similar words"
                checked={dedupe}
                onToggle={() => setDedupe(!dedupe)}
              />
            </div>
          </div>

          <div className="word-list" ref={ref}>
            {candidateWords.map((word, index) => {
              const wordClass = clsx("word", !wordConfirmed && "clickable");
              return (
                <Fragment key={index}>
                  <span className={wordClass} onClick={() => handleWordClick(word)}>
                    {word}
                  </span>
                  <span>
                    {index < candidateWords.length - 1 && '-'}
                  </span>
                </Fragment>
              );
            })}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="msg">
          <div className="info" style={{ marginBottom: '10px' }}>{"Loading dictionary..."}</div>
          <div className="loader" />
        </div>
      )}

      {loadingError && (
        <div className="msg">
          <div className="error">{loadingError}</div>
        </div>
      )}

    </>
  );
};

export default WordListPanel;
