import { create } from 'zustand'
import { GameLanguage } from './types';

interface SolverState {
  language: GameLanguage;
  wordLength: number;
  
  // Actions to update variables
  setLanguage: (_lang: GameLanguage) => void;
  setWordLength: (_len: number) => void;
  resetSolver: () => void;
}

export const useSolverStore = create<SolverState>(set => ({
  // Initial values
  language: null,
  wordLength: 0,

  // Actions
  setLanguage: lang => set({ language: lang }),
  setWordLength: len => set({ wordLength: len }),
  resetSolver: () => set({ language: 'English', wordLength: 0 }),
}));