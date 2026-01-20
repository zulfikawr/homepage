export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);

  try {
    // Use a fixed future date for "Present" to ensure deterministic sorting
    // and avoid hydration/prerender errors in Next.js 16.
    const PRESENT_DATE = new Date('9999-12-31');

    // Handle "Present" case
    if (dateString.includes('Present')) {
      return PRESENT_DATE;
    }

    // Handle date range format (e.g., "Jan 2024 - Present" or "Jan 2024 - Feb 2024")
    if (dateString.includes(' - ')) {
      const parts = dateString.split(' - ');
      const endDate = parts[parts.length - 1]; // Use the last part as end date

      // If end date is "Present", use current date
      if (endDate === 'Present') {
        return PRESENT_DATE;
      }
      // Otherwise use the end date
      return new Date(`${endDate} 1`);
    }

    return new Date(`${dateString} 1`);
  } catch {
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
