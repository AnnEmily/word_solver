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
    if (symbols.length === 1) return symbols[0];
    return `[${symbols.join('')}]`;
  }).join('');

  if (mustInclude.length > 0) {
    const lookaheads = mustInclude
      .map(l => `(?=.*${l})`)
      .join('');

    return new RegExp(`^${lookaheads}${body}$`);
  }

  return new RegExp(`^${body}$`);
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

export const filterDuplicatedLetters = (wordList: string[], allowDuplicated: boolean): string[] => {
  if (allowDuplicated) {
    return wordList;  
  }

  const regexp = /(.)(?=.*\1)/;

  return wordList.filter((word) => {
    // Remove diacritics (é → e, ç → c, ñ → n, etc.)
    const normalized = word
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return !regexp.test(normalized);
  });
};

export const removeWordsWithCapitals = (words: string[]): string[] => {
  return words.filter(word => !/[A-Z]/.test(word));
};
