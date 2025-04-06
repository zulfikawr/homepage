type MonthFormat = 'numeric' | '2-digit' | 'short' | 'long' | 'narrow';
type YearFormat = 'numeric' | '2-digit';
type DayFormat = 'numeric' | '2-digit';

interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  month?: MonthFormat;
  year?: YearFormat;
  day?: DayFormat;
  includeDay?: boolean;
}

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
