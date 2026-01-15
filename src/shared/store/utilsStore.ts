import { CandidateLetter, Word } from "../types";
import { alphabet } from '../constants';
import { assertExhaustive } from '../utilsString';

export const getEmptyWord = (len: number): Word => {
  return Array.from({ length: len }, () => ({ symbol: '', status: null }));
};

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
