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
