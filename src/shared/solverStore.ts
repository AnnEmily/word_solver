import { create } from 'zustand'
import { GameColors, GridCell, LanguageCode } from './types';
import { BACKSPACE, ENTER } from './constants';


interface SolverState {
  languageCode: LanguageCode;
  wordLength: number;
  letters: GridCell[];
  selectedKey: string;
  activeCellIndex: number;
  allLettersEntered: boolean;
  wordConfirmed: boolean;
  statusesConfirmed: boolean;
  colorSet: GameColors;
  
  // Actions to update variables
  setLanguageCode: (_code: LanguageCode) => void;
  setWordLength: (_len: number) => void;
  setColorSet: (_colorSet: GameColors) => void;

  setLetter: (_letter: string) => void;
  setLetters: (_letters: GridCell[]) => void;
  setWordConfirmed: () => void;
  setStatusesConfirmed: (_confirmed: boolean) => void;
  setSelectedKey: (_key: string) => void;
  setActiveCellIndex: (_index: number) => void;

  resetSolver: () => void;
}

export const useSolverStore = create<SolverState>(set => ({
  // Initial values
  languageCode: null,
  wordLength: 0,
  letters: [],
  allLettersEntered: false,
  selectedKey: null,
  activeCellIndex: 0,
  wordConfirmed: false,
  statusesConfirmed: false,
  colorSet: null,

  // Actions
  setLanguageCode: code => set({ languageCode: code }),
  setColorSet: colorSet => set({ colorSet }),
  
  setWordLength: len => {
    set({ wordLength: len });
    set({ letters: Array(len).fill({ symbol: '', status: undefined}) });
    set({ activeCellIndex: 0 });
  },
  
  setLetter: letter => {
    set(state => {

      if (letter === ENTER) {
        if (state.allLettersEntered) {
          return { wordConfirmed: true };
        }
      } else if (letter === BACKSPACE) {
        const newLetters = [...state.letters];
        newLetters[state.activeCellIndex].symbol = '';
        const newActiveCellIndex = state.activeCellIndex > 0 ? state.activeCellIndex - 1 : 0;

        return { letters: newLetters, activeCellIndex: newActiveCellIndex, allLettersEntered: false };
      } else {
        // Normal letter input
        const newLetters = [...state.letters];
        newLetters[state.activeCellIndex] = { symbol: letter, status: undefined};
        const newActiveCellIndex = (state.activeCellIndex === state.wordLength - 1) ? state.activeCellIndex : state.activeCellIndex + 1;
        const newAllLettersEntered = newLetters.every(letter => letter.symbol !== '');
        return { letters: newLetters, activeCellIndex: newActiveCellIndex, allLettersEntered: newAllLettersEntered };
      }
    });
  },
  setLetters: letters => set({ letters }),
  setWordConfirmed: () => set({ wordConfirmed: true }),
  setStatusesConfirmed: confirmed => set({ statusesConfirmed: confirmed }),

  setSelectedKey: key => set({ selectedKey: key }),
  setActiveCellIndex: index => set({ activeCellIndex: index }),

  resetSolver: () => set({
    languageCode: 'en',
    wordLength: 0,
    letters: [],
    selectedKey: null,
    activeCellIndex: 0,
    wordConfirmed: false,
    statusesConfirmed: false,
  }),
}));