import { FC, useEffect, useMemo, useState } from "react";
import { useShallow } from 'zustand/shallow';

const dictionaries = import.meta.glob('../../dico/*/*.js');

import { Panel } from "../../shared/components";
import { useSolverStore } from "../../shared/store";
import { LanguageCode } from "../..//shared/types";

export const WordListPanel: FC = () => {
  // States for inner control
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [dictionary, setDictionary] = useState<string[]>([]);

  // States to/from the store
  const languageCode = useSolverStore(useShallow(state => state.languageCode));
  const wordLength = useSolverStore(useShallow(state => state.wordLength));

  const loadDictionary = async (language: LanguageCode, wordLength: number): Promise<any> => {
      let dict: string[] = [];

      // const root = '../../dico';
      // const dir  = `${language}`;
      const name = `${wordLength.toString().length === 1 ? '0' + wordLength.toString() : wordLength.toString()}`;
      // const dictPath = `${root}/${dir}/${name}.js`;

      const dictPath = `../../dico/${language}/${name}.js`;

      const loader = dictionaries[dictPath];
      if (!loader) {
        throw new Error(`Dictionary not found: ${dictPath}`);
      }

      const Dictionary = await loader() as { Dictionary: string[] };
      dict = Dictionary.Dictionary;

      console.log('Loaded dictionary via glob import: ' + dict);

      // const xx = new URL(`${dictPath}`, import.meta.url).href;
      // console.log('Loading dictionary from URL: ' + xx);

      // fetch(xx)
      //   .then(response => {
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! status: ${response.status}`);
      //     }
      //     return response.text();
      //   })
      //   .then(() => {
      //     // Evaluate the fetched JavaScript code to extract the Dictionary
      //     const module = { exports: {} as any };
      //     dict = module.exports.Dictionary;
      //     console.log(`Fetched dictionary with ${dict.length} words.`);
      //     setDictionary(dict);
      //   })
      //   .catch(error => {
      //     console.error('Error fetching dictionary:', error);
      //   });

      // try {
      //   // Dynamic imports are always touchy. Disable vite warnings meanwhile we have a real backend.
      //   /* @vite-ignore */
      //   // const { Dictionary } = await import(/* @vite-ignore */ dictPath);
      //   const { Dictionary } = await import(dictPath);
      //   dict = Dictionary;

      // } catch (err) {
      //   const { message } = err as any;
      //   console.error('Error loading dictionary : ' + message);
      // }
  
      return { dict, dictPath };
  }

  useEffect(() => {
    loadDictionary(languageCode, wordLength)
      .then(({ dict, dictPath }) => {
        console.log(`Loaded dictionary from ${dictPath} with ${dict.length} words.`);
        setDictionary(dict);
      });
  }, [languageCode, wordLength]);

  const wordCount = useMemo(() => {
    return dictionary.length;
  }, [dictionary]);

  return (
    <Panel id="word-list-panel" title={'Word List'} isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)}>
      <div className="controls">
        <div>{'Checkbox no duplicate'}</div>
        <div>{`Word Count: ${wordCount.toLocaleString()}`}</div>
      </div>
      <div className="word-list">
        {dictionary.join(' - ')}
      </div>
    </Panel>
  );
};

export default WordListPanel;
