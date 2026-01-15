import { EMPTY_SYMBOL, letterColors } from "../../shared/constants";
import { CandidateLetter, GameColors, Grid, LETTER_STATUS, LetterStatus, Word } from "../../shared/types";

export const letterColorsBySet: Record<GameColors, Record<LetterStatus, string>> =
  Object.fromEntries(
    letterColors.map(({ colorSet, rightPlace, wrongPlace, notIncluded }) => [
      colorSet, { rightPlace, wrongPlace, notIncluded }
    ])
) as Record<GameColors, Record<LetterStatus, string>>;

export const getAllowedStatuses = (
  cellIndex: number,
  rowIndex: number,
  word: Word,
  grid: Grid,
  candidateLetters: CandidateLetter[],
): LetterStatus[] => {
  const log = false; // turn on if needed

  if (rowIndex !== null) {
    // User clicked in a grid cell where user already confirmed the status
    return [grid[rowIndex][cellIndex].status as LetterStatus];
  }

  // User clicked in a word cell
  const letter = word[cellIndex];

  // No symbol, then all statuses possible
  if (letter.symbol === EMPTY_SYMBOL) {
    if (log) console.log('path A for index = ' + cellIndex);
    return ['rightPlace', 'wrongPlace', 'notIncluded'];
  }

  // If symbol is not found in any candidates, it was rejected before
  const allSymbols = candidateLetters.flatMap(cl => cl.symbols);
  const symbolNotFound = allSymbols.find(s => s === letter.symbol) === undefined;
  if (symbolNotFound) {
    if (log) console.log('path B for index = ' + cellIndex);
    return ['notIncluded'];
  }

  const unsureEntries = candidateLetters.filter(cl => cl.symbols.length > 1);

  // Case of a cell whose symbol is in rightPLace
  if (candidateLetters[cellIndex].symbols.length === 1) {
    if (candidateLetters[cellIndex].symbols.includes(letter.symbol)) {
      if (log) console.log('path C1 for index = ' + cellIndex);
      return ['rightPlace'];
    }

    if (!unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
      // That symbol was declared wrong place befoe, then it still is
      if (log) console.log('path C2 for index = ' + cellIndex);
      return ['wrongPlace'];
    }

    // That symbol was never teste before
    if (log) console.log('path C3 for index = ' + cellIndex);
    return ['wrongPlace', 'notIncluded'];
  }

  const sureEntries = candidateLetters.filter(cl => cl.symbols.length === 1);

  // Considering letters that were declared in the right place before
  if (sureEntries.some(entry => entry.symbols.includes(letter.symbol))) {
    if (candidateLetters[cellIndex].symbols.length === 1 && candidateLetters[cellIndex].symbols[0] === letter.symbol) {
      if (log) console.log('path D1 for index = ' + cellIndex);
      return ['rightPlace'];
    } else {
      if (log) console.log('path D2 for index = ' + cellIndex);
      return ['rightPlace', 'wrongPlace'];
    }
  }

  // Case of a symbol that was never submitted
  if (unsureEntries.every(entry => entry.symbols.includes(letter.symbol))) {
    if (log) console.log('path E for index = ' + cellIndex);
    return ['rightPlace', 'wrongPlace', 'notIncluded'];
  }

  const unsureContainingSymbol = unsureEntries.filter(entry => entry.symbols.includes(letter.symbol));

  // Case of a symbol that was declared wrong, but is in fact left in only one candidate
  if (unsureContainingSymbol.length === 1) {
    if (unsureContainingSymbol[0].cellIndex === cellIndex) {
      if (log) console.log('path F1 for index = ' + cellIndex);
      return ['rightPlace'];
    } else {
      if (log) console.log('path F2 for index = ' + cellIndex);
      return ['wrongPlace'];
    }
  }

  // Case of a symbol that was declared wrong, but that is left in many candidate

  if (unsureContainingSymbol.length > 1) {
      if (log) console.log('path G for index = ' + cellIndex);
      return ['rightPlace', 'wrongPlace'];
  }

  if (log) console.log('path default for index = ' + cellIndex);
  return [...LETTER_STATUS];
};

export const getBgColorStyle = (status: LetterStatus, colorSet: GameColors) => {
  return { backgroundColor: letterColorsBySet[colorSet ?? 'default'][status] };
};
