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
    colorSet: 'default',
    wordLength: 5,
    link: 'https://gridgames.app/gridwords/',
  },
];

export const letterColors: LetterColors[] = [
  { id: 1, colorSet: 'Wordle', colors: { includedRight: '#5ca755', includedWrong: '#ad9738', notIncluded: '#787c7e' } },
  { id: 2, colorSet: 'Sutom', colors: { includedRight: '#e7002a', includedWrong: '#ffbd00', notIncluded: '#0077c7' } },
  { id: 3, colorSet: 'default', colors: { includedRight: '#32c232', includedWrong: '#fbbd08', notIncluded: '#ff0000' } },
];

// Must match dictionary .js files
export const availableWordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];
