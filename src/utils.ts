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

export const camelCaseToTitleCase = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }

  const intermStep = input.replace(/([A-Z])/g, ' $1');

  return intermStep.charAt(0).toUpperCase() + intermStep.slice(1);
};
