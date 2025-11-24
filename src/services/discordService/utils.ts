export const stringToTitleCase = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};