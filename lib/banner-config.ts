export type BannerWidth = 'half' | 'wide';

export interface BannerSetting {
  id: string;
  title: string;
  width: BannerWidth;
}

export const DEFAULT_BANNER_SETTINGS: BannerSetting[] = [
  { id: 'pages-and-links', title: 'Pages & Links', width: 'wide' },
  { id: 'github-contributions', title: 'GitHub Contributions', width: 'wide' },
  { id: 'visitor-geography', title: 'Visitor Geography', width: 'wide' },
  { id: 'top-languages', title: 'Top Languages', width: 'wide' },
  { id: 'spotify', title: 'Spotify', width: 'half' },
  { id: 'weather', title: 'Weather', width: 'half' },
];

/**
 * Group banners into rows. Wide banners get their own full-width row,
 * half-width banners are paired two per row.
 */
export const groupBannerRows = (
  settings: BannerSetting[],
): BannerSetting[][] => {
  const rows: BannerSetting[][] = [];
  let halfRow: BannerSetting[] = [];

  const flushHalfRow = () => {
    if (halfRow.length > 0) {
      rows.push(halfRow);
      halfRow = [];
    }
  };

  for (const setting of settings) {
    if (setting.width === 'wide') {
      flushHalfRow();
      rows.push([setting]);
    } else {
      halfRow.push(setting);
      if (halfRow.length === 2) flushHalfRow();
    }
  }

  flushHalfRow();
  return rows;
};
