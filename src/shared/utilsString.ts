import { LanguageCode, LanguageName } from "./types";

export const assertExhaustive = (_value: never): never => {
  const message = 'expected exhaustive covering of input';
  throw new Error(message);
};

export const insensitiveSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
};

export const languageCodeToName = (code: LanguageCode): LanguageName => {
  switch (code) {
    case 'en': return 'English';
    case 'fr': return 'French';
    case 'es': return 'Spanish';
    case 'de': return 'German';
    case null: return null;
    default: assertExhaustive(code);
  }
};

export const languageNameToCode = (name: LanguageName): LanguageCode => {
  switch (name) {
    case 'English': return 'en';
    case 'French': return 'fr';
    case 'Spanish': return 'es';
    case 'German': return 'de';
    default: assertExhaustive(name);
  }
};