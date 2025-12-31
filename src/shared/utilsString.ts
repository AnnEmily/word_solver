export const insensitiveSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
};
