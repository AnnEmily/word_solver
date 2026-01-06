import { create } from 'zustand'
import { LanguageCode } from './types';

interface SolverState {
  languageCode: LanguageCode;
  wordLength: number;
  
  // Actions to update variables
  setLanguageCode: (_code: LanguageCode) => void;
  setWordLength: (_len: number) => void;
  resetSolver: () => void;
}

export const useSolverStore = create<SolverState>(set => ({
  // Initial values
  languageCode: null,
  wordLength: 0,

  // Actions
  setLanguageCode: code => set({ languageCode: code }),
  setWordLength: len => set({ wordLength: len }),
  resetSolver: () => set({ languageCode: 'en', wordLength: 0 }),
}));