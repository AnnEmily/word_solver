import { GameSet } from "../shared/types";

export const games: GameSet[] = [
  { id: 1, provider: 'Wordle', language: 'English', colors: 'Wordle', wordLength: 5 },
  { id: 2, provider: 'Sutom', language: 'French', colors: 'Sutom', wordLength: null },
  { id: 3, provider: 'La palabra del día', language: 'Spanish', colors: 'Wordle', wordLength: 5 },
  { id: 4, provider: 'GridGames', language: 'German', colors: 'default', wordLength: 5 },
];
