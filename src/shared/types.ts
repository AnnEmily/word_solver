export type GameProvider = 'Wordle' | 'Sutom' | 'La palabra del día' | 'GridGames' | 'other';
export type GameLanguage = 'English' | 'French' | 'Spanish' | 'German' | 'Other';
export type GameColors = 'Wordle' | 'Sutom' | 'default';

export type GameSet = {
  id: number;
  provider: GameProvider;
  language: GameLanguage;
  colors: GameColors;
  wordLength: number;
};
