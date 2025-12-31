export const GAME_PROVIDERS = ['Wordle','Sutom', 'La palabra del día','Grid Games'] as const;
export type GameProvider = typeof GAME_PROVIDERS[number];

export const GAME_LANGUAGES = ['English', 'French', 'Spanish', 'German'] as const;
export type GameLanguage = typeof GAME_LANGUAGES[number];

export const GAME_COLORS = ['Wordle', 'Sutom', 'default'] as const;
export type GameColors = typeof GAME_COLORS[number];

export const GAME_COUNTRY = ['US', 'FR', 'CO', 'DE'] as const;
export type GameCountry = typeof GAME_COUNTRY[number];

export type GameSet = {
  id: number;
  name: GameProvider;
  country: GameCountry;
  language: GameLanguage;
  colorSet: GameColors;
  wordLength: number;
  link: string;
};

export type LetterColors = {
  id: number;
  colorSet: GameColors;
  colors: {
    includedRight: string;
    includedWrong: string;
    notIncluded: string;
  }; 
};