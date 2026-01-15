import { create } from 'zustand';
import { CandidateLetter, GameColors, Grid, LanguageCode, Word } from '../types';
import { BACKSPACE, ENTER } from '../constants';
import { getEmptyWord, getInitialCandidateLetters, updateCandidateLetters } from './utilsStore';

interface SolverState {
  // General state vars
  colorSet: GameColors | null;
  languageCode: LanguageCode | null;
  wordLength: number;

  // Working state vars
  activeCellIndex: number;        // the active letter position in word. A letter typed will populate that cell
  grid: Grid;                     // the words entered previously. Var 'word' is excluded from 'grid'
  statusesConfirmed: boolean;     // set to true when user set the status of each letter in word and clicked DONE
  word: Word;                     // the active word, whose letters are being entered
  wordConfirmed: boolean;         // set to true after user entered all letters and hit ENTER

  // State vars only set by the store, but used by the app
  allLettersEntered: boolean;
  candidateLetters: CandidateLetter[];
  mustInclude: Set<string>;       // letters that we know must be in the word (rightPlace or wrongPlace)
  wordFound: boolean;             // set to true when user reached the solution

  // Actions to update state vars
  setLanguageCode: (_code: LanguageCode) => void;
  setColorSet: (_colorSet: GameColors) => void;
  setActiveCellIndex: (_index: number) => void;
  setWordLength: (_len: number) => void;
  setGrid: (_word: Word) => void;
  setWord: (_letters: Word) => void;
  setLetter: (_letter: string) => void;
  setWordConfirmed: () => void;
  
  resetSolver: () => void;
}

export const useSolverStore = create<SolverState>(set => ({
  // Initial values
  activeCellIndex: 0,
  allLettersEntered: false,
  candidateLetters: [],
  colorSet: null,
  grid: [],
  languageCode: null,
  mustInclude: new Set<string>(),
  statusesConfirmed: false,
  word: [],
  wordConfirmed: false,
  wordFound: false,
  wordLength: 0,

  // Actions
  setLanguageCode: code => set({ languageCode: code }),
  setColorSet: colorSet => set({ colorSet }),
  
  setWordLength: len => 
    set({
    wordLength: len,
    word: getEmptyWord(len),
    candidateLetters: getInitialCandidateLetters(len),
    activeCellIndex: 0,
  }),

  setActiveCellIndex: index => set({ activeCellIndex: index }),
  
  setLetter: letter => {
    set(state => {

      if (letter === ENTER) {
        if (state.allLettersEntered) {
          return { wordConfirmed: true, allLettersEntered: false };
        }
        return {};
      } else if (letter === BACKSPACE) {
        const newWord = [...state.word];
        newWord[state.activeCellIndex].symbol = '';
        const newCellIndex = Math.max(state.activeCellIndex - 1, 0);

        return { word: newWord, activeCellIndex: newCellIndex, allLettersEntered: false };
      } else {
        // Normal letter input
        const newWord = [...state.word];
        newWord[state.activeCellIndex] = { symbol: letter, status: null };
        const newActiveCellIndex = (state.activeCellIndex === state.wordLength - 1) ? state.activeCellIndex : state.activeCellIndex + 1;
        const newAllLettersEntered = newWord.every(letter => letter.symbol !== '');
        return { word: newWord, activeCellIndex: newActiveCellIndex, allLettersEntered: newAllLettersEntered };
      }
    });
  },
  setWord: word => set({
    allLettersEntered: true,
    word,
  }),

  setWordConfirmed: () => set({ wordConfirmed: true }),

  setGrid: word => {
    set(state => {
      const newMustInclude = state.mustInclude;

      word.forEach(letter => {
        if (letter.status === 'rightPlace' || letter.status === 'wrongPlace') {
          newMustInclude.add(letter.symbol);
        }
      });

      const newGrid = [...state.grid, word];
      const gridRowCount = newGrid.length;
      const wordFound = newGrid[gridRowCount - 1].every(word => word.status === 'rightPlace');
      return {
        activeCellIndex: 0,
        allLettersEntered: false,
        candidateLetters: updateCandidateLetters(word, state.candidateLetters),
        grid: newGrid,
        mustInclude: newMustInclude,
        statusesConfirmed: false,
        word: getEmptyWord(state.wordLength),
        wordConfirmed: false,
        wordFound,
      };
    });
  },

  resetSolver: () => set( state => ({
    activeCellIndex: 0,
    candidateLetters: [],
    colorSet: state.colorSet,
    grid: [],
    languageCode: null,
    mustInclude: new Set<string>(),
    statusesConfirmed: false,
    word: [],
    wordConfirmed: false,
    wordFound: false,
    wordLength: 0,
  })),
}));
