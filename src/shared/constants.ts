import { GameSet, LetterColors } from "../shared/types";

export const games: GameSet[] = [
  { id: 1, name: 'Wordle', language: 'English', country: 'US', colorSet: 'Wordle', wordLength: 5 },
  { id: 2, name: 'Sutom', language: 'French', country: 'FR', colorSet: 'Sutom', wordLength: null },
  { id: 3, name: 'La palabra del día', country: 'CO', language: 'Spanish', colorSet: 'Wordle', wordLength: 5 },
  { id: 4, name: 'Grid Games', language: 'German', country: 'DE', colorSet: 'default', wordLength: 5 },
];

export const letterColors: LetterColors[] = [
  { id: 1, colorSet: 'Wordle', colors: { includedRight: '#5ca755', includedWrong: '#ad9738', notIncluded: '#787c7e' } },
  { id: 2, colorSet: 'Sutom', colors: { includedRight: '#e7002a', includedWrong: '#ffbd00', notIncluded: '#0077c7' } },
  { id: 3, colorSet: 'default', colors: { includedRight: '#32c232', includedWrong: '#fbbd08', notIncluded: '#ff0000' } },
];

// Must match dictionary .js files
export const availableWordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];

// Must match file names in assets directory
export const countryToFlag = new Map<string, string>([
  ['US', 'flag_US.png'],
  ['FR', 'flag_FR.jpg'],
  ['CO', 'flag_CO.jpg'],
  ['DE', 'flag_DE.jpg'], 
]);
