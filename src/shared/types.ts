export type GameProvider = 'Wordle' | 'Sutom' | 'La palabra del día' | 'Grid Games';
export type GameLanguage = 'English' | 'French' | 'Spanish' | 'German';
export type GameColors = 'Wordle' | 'Sutom' | 'default';

export type GameSet = {
  id: number;
  name: GameProvider;
  language: GameLanguage;
  colors: GameColors;
  wordLength: number;
};
