import { parseDateTimestamp } from './sort-by-date';

type MonthFormat = 'numeric' | '2-digit' | 'short' | 'long' | 'narrow';
type YearFormat = 'numeric' | '2-digit';
type DayFormat = 'numeric' | '2-digit';

interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  month?: MonthFormat;
  year?: YearFormat;
  day?: DayFormat;
  includeDay?: boolean;
}

/**
 * Parse the app's display date strings ("5 Oct 2025", "Oct 2025 - Present")
 * into a valid Date. Falls back instead of producing an Invalid Date, which
 * used to render as NaN in the date picker.
 */
export const parseDateString = (
  value?: string | Date | null,
  part: 'start' | 'end' = 'end',
  fallback: Date = new Date(),
): Date => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? fallback : value;
  }
  if (!value) return fallback;

  const timestamp = parseDateTimestamp(value, part);
  if (timestamp <= 0) return fallback;

  // Build the date in local time so the calendar picker shows the same
  // day/month/year in every timezone.
  const utc = new Date(timestamp);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
};

export const parseDateRangeString = (
  value?: string | null,
  fallback: Date = new Date(),
): { start: Date; end: Date; isPresent: boolean } => {
  return {
    start: parseDateString(value, 'start', fallback),
    end: parseDateString(value, 'end', fallback),
    isPresent: Boolean(value?.includes('Present')),
  };
};

export const formatDate = (
  date: Date | string,
  options: DateFormatOptions = {
    month: 'short',
    year: 'numeric',
    includeDay: true,
  },
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: options.month || 'short',
    year: options.year || 'numeric',
  };

  if (options.includeDay || options.day) {
    formatOptions.day = options.day || 'numeric';
  }

  return dateObj.toLocaleDateString('en-GB', formatOptions);
};

export const formatDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  isPresent: boolean = false,
  includeDay: boolean = false,
): string => {
  const start = formatDate(startDate, {
    month: 'short',
    year: 'numeric',
    includeDay,
  });
  const end = isPresent
    ? 'Present'
    : formatDate(endDate, {
        month: 'short',
        year: 'numeric',
        includeDay,
      });
  return `${start} - ${end}`;
};
