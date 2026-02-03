export const parse_date = (date_string: string): Date => {
  if (!date_string) return new Date(0);

  try {
    // Use a fixed future date for "Present" to ensure deterministic sorting
    // and avoid hydration/prerender errors in Next.js 16.
    const PRESENT_DATE = new Date('9999-12-31');

    // Handle "Present" case
    if (date_string.includes('Present')) {
      return PRESENT_DATE;
    }

    // Handle date range format (e.g., "Jan 2024 - Present" or "Jan 2024 - Feb 2024")
    if (date_string.includes(' - ')) {
      const parts = date_string.split(' - ');
      const end_date = parts[parts.length - 1]; // Use the last part as end date

      // If end date is "Present", use current date
      if (end_date === 'Present') {
        return PRESENT_DATE;
      }
      // Otherwise use the end date
      return new Date(`${end_date} 1`);
    }

    return new Date(`${date_string} 1`);
  } catch {
    return new Date(0);
  }
};

export const sortByDate = <T extends { date_string?: string }>(
  data: T[],
): T[] => {
  return [...data].sort((a, b) => {
    if (!a.date_string && !b.date_string) return 0;
    if (!a.date_string) return 1;
    if (!b.date_string) return -1;

    const date_a = parse_date(a.date_string);
    const date_b = parse_date(b.date_string);
    return date_b.getTime() - date_a.getTime();
  });
};
