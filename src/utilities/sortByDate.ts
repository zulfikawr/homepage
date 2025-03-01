export const parseDate = (dateString: string): Date => {
  if (dateString.includes('Present')) {
    return new Date();
  }
  const [month, year] = dateString.split(' ');
  return new Date(`${month} 1, ${year}`);
};

export const sortByDate = <T extends { dateString?: string; date?: string }>(
  data: T[],
): T[] => {
  return [...data].sort((a, b) => {
    const dateA = parseDate(a.dateString || a.date || '');
    const dateB = parseDate(b.dateString || b.date || '');
    return dateB.getTime() - dateA.getTime();
  });
};
