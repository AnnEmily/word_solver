import { create } from 'zustand'
import { GameColors, GridCell, LanguageCode, Word } from './types';
import { BACKSPACE, ENTER } from './constants';

const getEmptyWord = (len: number): Word => {
  return Array(len).fill({ symbol: '', status: undefined});
};

interface SolverState {
  // State vars
  languageCode: LanguageCode;
  colorSet: GameColors;

  wordLength: number;
  word: Word;                   // the active word, whose letters are being entered
  activeCellIndex: number;      // the active letter position of 'word'. A letter typed will populate that cell
  wordConfirmed: boolean;       // set to true after user entered all letters and hit ENTER
  statusesConfirmed: boolean;   // set to true when user set the status of each letter in 'word' and clicked DONE

  grid: Word[];                 // the words entered previously. Var 'word' is excluded from 'grid'

  // Used internally by the store
  allLettersEntered: boolean;
    
  // Actions to update state vars
  setLanguageCode: (_code: LanguageCode) => void;
  setColorSet: (_colorSet: GameColors) => void;

  setWordLength: (_len: number) => void;
  setGrid: (_word: Word) => void;
  setWord: (_letters: Word) => void;
  setLetter: (_letter: string) => void;
  setWordConfirmed: () => void;
  setStatusesConfirmed: (_confirmed: boolean) => void;
  
  resetSolver: () => void;
}

export const useSolverStore = create<SolverState>(set => ({
  // Initial values
  languageCode: null,
  wordLength: 0,
  word: [],
  grid: [],
  allLettersEntered: false,
  activeCellIndex: 0,
  wordConfirmed: false,
  statusesConfirmed: false,
  colorSet: null,

  // Actions
  setLanguageCode: code => set({ languageCode: code }),
  setColorSet: colorSet => set({ colorSet }),
  
  setWordLength: len => set({
    wordLength: len,
    word: getEmptyWord(len),
    activeCellIndex: 0,
  }),

  setLetter: letter => {
    set(state => {

      if (letter === ENTER) {
        if (state.allLettersEntered) {
          return { wordConfirmed: true, allLettersEntered: false };
        }
      } else if (letter === BACKSPACE) {
        const newWord = [...state.word];
        newWord[state.activeCellIndex].symbol = '';
        const newActiveCellIndex = state.activeCellIndex > 0 ? state.activeCellIndex - 1 : 0;

        return { word: newWord, activeCellIndex: newActiveCellIndex, allLettersEntered: false };
      } else {
        // Normal letter input
        const newWord = [...state.word];
        newWord[state.activeCellIndex] = { symbol: letter, status: undefined};
        const newActiveCellIndex = (state.activeCellIndex === state.wordLength - 1) ? state.activeCellIndex : state.activeCellIndex + 1;
        const newAllLettersEntered = newWord.every(letter => letter.symbol !== '');
        return { word: newWord, activeCellIndex: newActiveCellIndex, allLettersEntered: newAllLettersEntered };
      }
    });
  },
  setWord: word => set({ word }),
  setWordConfirmed: () => set({ wordConfirmed: true }),
  setStatusesConfirmed: confirmed => set({ statusesConfirmed: confirmed }),

  setGrid: word => {
    set(state => {
      return {
        grid: [...state.grid, word],
        word: getEmptyWord(state.wordLength),
        activeCellIndex: 0,
        wordConfirmed: false,
        allLettersEnterd: false,
        statusesConfirmed: false,
      }
    });
  },

  resetSolver: () => set({
    languageCode: 'en',
    wordLength: 0,
    word: [],
    activeCellIndex: 0,
    wordConfirmed: false,
    statusesConfirmed: false,
  }),
}));