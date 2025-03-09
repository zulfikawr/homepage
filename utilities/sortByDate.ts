export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);

  try {
    // Handle "Present" case
    if (dateString.includes('Present')) {
      return new Date();
    }

    // Handle date range format (e.g., "Jan 2024 - Present" or "Jan 2024 - Feb 2024")
    if (dateString.includes(' - ')) {
      const [endDate] = dateString.split(' - ');
      // If end date is "Present", use current date
      if (endDate === 'Present') {
        return new Date();
      }
      // Otherwise use the end date
      return new Date(`${endDate} 1`);
    }

    return new Date(`${dateString} 1`);
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date(0);
  }
};

export const sortByDate = <T extends { dateString?: string }>(
  data: T[],
): T[] => {
  return [...data].sort((a, b) => {
    if (!a.dateString && !b.dateString) return 0;
    if (!a.dateString) return 1;
    if (!b.dateString) return -1;

    const dateA = parseDate(a.dateString);
    const dateB = parseDate(b.dateString);
    return dateB.getTime() - dateA.getTime();
  });
};
