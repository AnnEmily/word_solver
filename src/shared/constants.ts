import { GameSet, LetterColors } from "../shared/types";

export const games: GameSet[] = [
  {
    id: 1,
    name: 'Wordle',
    languageCode: 'en',
    country: 'US',
    colorSet: 'Wordle',
    wordLength: 5,
    link: 'https://www.nytimes.com/games/wordle/index.html',
  },
  {
    id: 2,
    name: 'Sutom',
    languageCode: 'fr',
    country: 'FR',
    colorSet: 'Sutom',
    wordLength: null,
    link: 'https://sutom.nocle.fr/#',
  },
  {
    id: 3,
    name: 'La palabra del día',
    country: 'CO',
    languageCode: 'es',
    colorSet: 'Wordle',
    wordLength: 5,
    link: 'https://lapalabradeldia.com/',
  },
  {
    id: 4,
    name: 'Grid Games',
    languageCode: 'de',
    country: 'DE',
    colorSet: 'GridGames',
    wordLength: 5,
    link: 'https://gridgames.app/gridwords/',
  },
];

export const letterColors: LetterColors[] = [
  { id: 1, colorSet: 'Wordle', rightPlace: '#538D4E', wrongPlace: '#B59F3B', notIncluded: '#3A3A3C' },
  { id: 2, colorSet: 'Sutom', rightPlace: '#e7002a', wrongPlace: '#ffbd00', notIncluded: '#0077c7' },
  { id: 3, colorSet: 'default', rightPlace: '#32c232', wrongPlace: '#fbbd08', notIncluded: '#ff0000' },
  { id: 4, colorSet: 'GridGames', rightPlace: '#55BB55', wrongPlace: '#D8AE30', notIncluded: '#555555' },
];

// Must match dictionary .js files
export const availableWordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];

export const ENTER = '⏎';
export const BACKSPACE = '⌫';
export const EMPTY_SYMBOL = "";

export const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i) // uppercase letters
);

export const qwertyKeyboard: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [ENTER, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', BACKSPACE],
];
