// import { sortBy } from 'lodash';
import { CandidateLetter, LetterStatus, Word } from "../types";
import { alphabet } from '../constants';
import { assertExhaustive } from '../utilsString';

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  rightPlace: 3,
  wrongPlace: 2,
  notIncluded: 1,
};

export const getEmptyWord = (len: number): Word => {
  return Array.from({ length: len }, () => ({ symbol: '', status: null }));
};

// export const getStatusResults = (grid: Word[]): StatusResult[] => {
//   const map = new Map<string, StatusResult>();

//   grid.forEach(word => {
//     word.forEach((letter, letterIndex) => {
//       if (letter.status) {
//         const existingEntry = map.get(letter.symbol);

//         if (!existingEntry) {
//           map.set(letter.symbol, {
//             symbol: letter.symbol,
//             status: letter.status,
//             indexes: [letterIndex],
//           });
//         } else if (existingEntry.status === letter.status) {
//           existingEntry.indexes = [...new Set([...existingEntry.indexes, letterIndex])];
//         } else {
//           if (STATUS_PRIORITY[letter.status] > STATUS_PRIORITY[existingEntry.status]) {
//             existingEntry.status = letter.status;
//             existingEntry.indexes = [letterIndex];
//           } else {
//             existingEntry.indexes = [letterIndex];
//           }
//         }
//       }
//     })
//   });

//   return sortBy([...map.values()], 'symbol');
// };

export const getInitialCandidateLetters = (wordLength: number): CandidateLetter[] => {
  const indexes = Array.from({ length: wordLength }, (_, i) => i);
  return indexes.map(cellIndex => ({
    cellIndex,
    symbols: [...alphabet],
  }));
};

export const updateCandidateLetters = (word: Word, prevCandidateLetters: CandidateLetter[]) => {
  let candidateLetters = [...prevCandidateLetters];

  word.forEach((letter, cellIndex) => {
    switch(letter.status) {
      case 'rightPlace':
        // Current letter.symbol is the only candidate possible in that cell
        candidateLetters[cellIndex].symbols = [letter.symbol];
        break;
      case 'wrongPlace':
        // Current letter.symbol must be removed from candidate symbols only in that cell
        candidateLetters[cellIndex].symbols = candidateLetters[cellIndex].symbols.filter(symb => symb !== letter.symbol);
        break;
      case 'notIncluded':
        // Current letter.symbol must be removed everywhere from candidate symbols
        candidateLetters.forEach((entry, cellIndex) => {
          candidateLetters[cellIndex].symbols = entry.symbols.filter(symb => symb !== letter.symbol);
        })
        break;
      default:
        assertExhaustive(letter.status);
    }
  });

  return candidateLetters;
};
