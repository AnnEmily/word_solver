import { DIACRITIC_MAP } from "../../shared/constants";
import { CandidateLetter } from "../../shared/types";

export const deriveMustInclude = (length: number, candidates: CandidateLetter[]): string[] => {
  const byIndex = Array.from({ length }, (_, i) =>
    new Set(candidates.find(c => c.cellIndex === i)?.symbols ?? [])
  );

  const allLetters = new Set<string>();
  byIndex.forEach(set => set.forEach(l => allLetters.add(l)));

  const mustInclude: string[] = [];

  for (const letter of allLetters) {
    let appearsSomewhere = false;
    let missingSomewhere = false;

    for (const set of byIndex) {
      if (set.has(letter)) appearsSomewhere = true;
      else missingSomewhere = true;
    }

    if (appearsSomewhere && missingSomewhere) {
      mustInclude.push(letter);
    }
  }

  return mustInclude;
};

// AEG remove
// export const buildRegexFromCandidates = (
//   wordLength: number,
//   candidates: CandidateLetter[],
//   mustInclude: string[] = []
// ): RegExp => {

//   const byIndex = Array.from({ length: wordLength }, (_, i) =>
//     candidates.find(c => c.cellIndex === i)?.symbols ?? []
//   );

//   const body = byIndex.map(symbols => {
//     if (symbols.length === 0) return '.';
//     if (symbols.length === 1) return symbols[0];
//     return `[${symbols.join('')}]`;
//   }).join('');

//   if (mustInclude.length > 0) {
//     const lookaheads = mustInclude
//       .map(l => `(?=.*${l})`)
//       .join('');

//     return new RegExp(`^${lookaheads}${body}$`);
//   }

//   return new RegExp(`^${body}$`);
// };

const expandSymbol = (symbol: string): string => {
  const lower = symbol.toLowerCase();
  const variants = DIACRITIC_MAP[lower];

  if (!variants) {
    return symbol; // b, d, f, etc.
  }

  return `[${variants}${variants.toUpperCase()}]`;
};
export const buildRegexFromCandidates = (
  wordLength: number,
  candidates: CandidateLetter[],
  mustInclude: string[] = []
): RegExp => {

  const byIndex = Array.from({ length: wordLength }, (_, i) =>
    candidates.find(c => c.cellIndex === i)?.symbols ?? []
  );

  const body = byIndex.map(symbols => {
    if (symbols.length === 0) return '.';

    const expanded = symbols.map(expandSymbol);

    if (expanded.length === 1) return expanded[0];
    return `(?:${expanded.join('|')})`;
  }).join('');

  if (mustInclude.length > 0) {
    const lookaheads = mustInclude
      .map(l => `(?=.*${expandSymbol(l)})`)
      .join('');

    return new RegExp(`^${lookaheads}${body}$`, 'u');
  }

  return new RegExp(`^${body}$`, 'u');
};

export const dedupeIgnoringDiacriticsAndCase = (
  words: string[]
): string[] => {
  const seen = new Set<string>();

  const normalize = (str: string) =>
    str
      .normalize('NFD')                 // split accents
      .replace(/[\u0300-\u036f]/g, '')  // remove accents
      .toLowerCase();                  // ignore capitalization

  return words.filter((word) => {
    const key = normalize(word);

    if (seen.has(key)) {
      return false; // drop duplicates
    }

    seen.add(key);
    return true; // keep first occurrence
  });
};

// export const filterDuplicatedLetters = (wordList: string[], allowDuplicated: boolean): string[] => {
//   if (allowDuplicated) {
//     return wordList;
//   }

//   const regexp = /(.)(?=.*\1)/;

//   return wordList.filter((word) => {
//     // Remove diacritics (é → e, ç → c, ñ → n, etc.)
//     const normalized = word
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '');

//     return !regexp.test(normalized);
//   });
// };

export const filterDuplicatedLetters = (
  wordList: string[],
  allowDuplicated: boolean
): string[] => {
  if (allowDuplicated) {
    return wordList;
  }

  const duplicatedLetterRegexp = /(.)(?=.*\1)/;

  return wordList.filter((originalWord) => {
    const wordForTest = originalWord
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(); // optional but usually a good idea

    return !duplicatedLetterRegexp.test(wordForTest);
  });
};

export const removeWordsWithCapitals = (words: string[]): string[] => {
  return words.filter(word => !/[A-Z]/.test(word));
};
