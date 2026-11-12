const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

// Fixed end-of-time value so "Present" always sorts first and never depends on
// the current clock, which differs between server and client.
const PRESENT_TIMESTAMP = Date.UTC(9999, 11, 31);

/**
 * Parse the app's date strings without relying on the engine's Date parser.
 * Safari, V8 and JavaScriptCore all accept different formats, which caused
 * server/client sort order mismatches during hydration.
 */
export const parseDateTimestamp = (
  dateString: string,
  part: 'start' | 'end' = 'end',
): number => {
  if (!dateString) return 0;

  const parts = dateString.includes(' - ')
    ? dateString.split(' - ')
    : [dateString];
  const target = (part === 'start' ? parts[0] : parts[parts.length - 1]).trim();

  if (!target) return 0;
  if (target.toLowerCase().includes('present')) return PRESENT_TIMESTAMP;

  const monthMatch = target.match(/[A-Za-z]{3,9}/);
  const yearMatch = target.match(/\b(\d{4})\b/);
  if (monthMatch && yearMatch) {
    const month = MONTHS[monthMatch[0].slice(0, 3).toLowerCase()];
    if (month !== undefined) {
      // Only treat a leading number as the day, so the year is never picked up.
      const dayMatch = target.match(/^\s*(\d{1,2})\b/);
      const day = dayMatch ? Number(dayMatch[1]) : 1;
      const year = Number(yearMatch[1]);
      return Date.UTC(year, month, day);
    }
  }

  const fallback = Date.parse(target);
  return Number.isNaN(fallback) ? 0 : fallback;
};

export const parseDate = (date_string: string): Date => {
  return new Date(parseDateTimestamp(date_string));
};

export const compareDates = (a: string, b: string): number => {
  const difference = parseDateTimestamp(b) - parseDateTimestamp(a);
  return difference !== 0 ? difference : 0;
};

export const compareIds = (a: { id?: string }, b: { id?: string }): number => {
  const idA = a.id || '';
  const idB = b.id || '';
  return idA < idB ? -1 : idA > idB ? 1 : 0;
};

export const sortByDate = <T extends { date_string?: string; id?: string }>(
  data: T[],
): T[] => {
  return [...data].sort((a, b) => {
    if (!a.date_string && !b.date_string) return compareIds(a, b);
    if (!a.date_string) return 1;
    if (!b.date_string) return -1;

    const endDifference = compareDates(a.date_string, b.date_string);
    if (endDifference !== 0) return endDifference;

    // For ongoing/equal-end entries, newer start dates come first.
    const startDifference =
      parseDateTimestamp(b.date_string, 'start') -
      parseDateTimestamp(a.date_string, 'start');
    if (startDifference !== 0) return startDifference;

    return compareIds(a, b);
  });
};
