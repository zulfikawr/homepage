export type BannerWidth = 'half' | 'wide' | 'disabled';

export interface BannerDefinition {
  id: string;
  title: string;
  defaultWidth: BannerWidth;
}

export interface BannerSetting {
  id: string;
  title: string;
  width: BannerWidth;
  order: number;
}

export const BANNER_DEFINITIONS: BannerDefinition[] = [
  { id: 'pages-and-links', title: 'Pages & Links', defaultWidth: 'wide' },
  {
    id: 'github-contributions',
    title: 'GitHub Contributions',
    defaultWidth: 'wide',
  },
  {
    id: 'visitor-geography',
    title: 'Visitor Geography',
    defaultWidth: 'wide',
  },
  { id: 'top-languages', title: 'Top Languages', defaultWidth: 'wide' },
  { id: 'spotify', title: 'Spotify', defaultWidth: 'half' },
  { id: 'weather', title: 'Weather', defaultWidth: 'half' },
];

export const DEFAULT_BANNER_SETTINGS: BannerSetting[] = BANNER_DEFINITIONS.map(
  (banner, index) => ({
    id: banner.id,
    title: banner.title,
    width: banner.defaultWidth,
    order: index,
  }),
);

export const isBannerWidth = (value: unknown): value is BannerWidth =>
  value === 'half' || value === 'wide' || value === 'disabled';

/**
 * Group enabled banners into rows. Wide banners get their own full-width row,
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
    if (setting.width === 'disabled') continue;

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
