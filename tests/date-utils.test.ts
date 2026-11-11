import { describe, expect, it } from 'bun:test';

import {
  parseDateRangeString,
  parseDateString,
} from '../utilities/format-date';
import { parseDateTimestamp, sortByDate } from '../utilities/sort-by-date';

const ymd = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) =>
      index === 0 ? String(part) : String(part).padStart(2, '0'),
    )
    .join('-');

describe('date parsing', () => {
  it('parses single dates without engine-specific Date parsing', () => {
    expect(ymd(parseDateString('5 Oct 2025'))).toBe('2025-10-05');
    expect(ymd(parseDateString('6 Nov 2025'))).toBe('2025-11-06');
    expect(ymd(parseDateString('5 Feb 2026'))).toBe('2026-02-05');
  });

  it('parses the start and end of ranges', () => {
    const range = parseDateRangeString('Oct 2024 - Dec 2024');
    expect(ymd(range.start)).toBe('2024-10-01');
    expect(ymd(range.end)).toBe('2024-12-01');
    expect(range.isPresent).toBe(false);
  });

  it('treats Present as an open-ended end date', () => {
    const range = parseDateRangeString('Feb 2026 - Present');
    expect(ymd(range.start)).toBe('2026-02-01');
    expect(range.isPresent).toBe(true);
    expect(Number.isNaN(range.end.getTime())).toBe(false);
  });

  it('falls back to a valid Date instead of Invalid Date', () => {
    const fallback = new Date(Date.UTC(2020, 0, 2));
    expect(ymd(parseDateString('not a date', 'end', fallback))).toBe(
      '2020-01-02',
    );
    expect(Number.isNaN(parseDateString('', 'end', fallback).getTime())).toBe(
      false,
    );
    expect(parseDateTimestamp('not a date')).toBe(0);
  });

  it('sorts by date and uses a stable id tiebreaker', () => {
    const items = [
      { id: 'b', date_string: 'Dec 2025 - Dec 2025' },
      { id: 'a', date_string: 'Dec 2025 - Dec 2025' },
      { id: 'c', date_string: 'Feb 2026 - Present' },
      { id: 'd', date_string: 'Oct 2024 - Dec 2024' },
    ];
    expect(sortByDate(items).map((i) => i.id)).toEqual(['c', 'a', 'b', 'd']);
  });
});
