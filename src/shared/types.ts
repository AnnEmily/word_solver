export const GAME_PROVIDERS = ['Wordle','Sutom', 'La palabra del día','Grid Games'] as const;
export type GameProvider = typeof GAME_PROVIDERS[number];

export const LANGUAGE_CODES = ['en', 'fr', 'es', 'de'] as const;
export type LanguageCode = typeof LANGUAGE_CODES[number];

export const LANGUAGE_NAMES = ['English', 'French', 'Spanish', 'German'] as const;
export type LanguageName = typeof LANGUAGE_NAMES[number];

export const GAME_COLORS = ['Wordle', 'Sutom', 'default'] as const;
export type GameColors = typeof GAME_COLORS[number];

export const GAME_COUNTRY = ['US', 'FR', 'CO', 'DE'] as const;
export type GameCountry = typeof GAME_COUNTRY[number];

export type GameSet = {
  id: number;
  name: GameProvider;
  country: GameCountry;
  languageCode: LanguageCode;
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