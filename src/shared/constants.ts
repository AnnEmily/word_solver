import { GameSet } from "../shared/types";

export const games: GameSet[] = [
  { id: 1, name: 'Wordle', language: 'English', colors: 'Wordle', wordLength: 5 },
  { id: 2, name: 'Sutom', language: 'French', colors: 'Sutom', wordLength: null },
  { id: 3, name: 'La palabra del día', language: 'Spanish', colors: 'Wordle', wordLength: 5 },
  { id: 4, name: 'Grid Games', language: 'German', colors: 'default', wordLength: 5 },
];

// Must match dictionary .js files
export const availableWordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];