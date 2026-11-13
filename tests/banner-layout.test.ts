import { describe, expect, it } from 'bun:test';

import { BannerSetting, groupBannerRows } from '../lib/banner-config';

const banner = (id: string, width: BannerSetting['width']): BannerSetting => ({
  id,
  title: id,
  width,
});

describe('banner layout', () => {
  it('keeps wide banners on their own full row', () => {
    const rows = groupBannerRows([
      banner('wide-a', 'wide'),
      banner('wide-b', 'wide'),
    ]);
    expect(rows.map((row) => row.map((item) => item.id))).toEqual([
      ['wide-a'],
      ['wide-b'],
    ]);
  });

  it('pairs consecutive half-width banners', () => {
    const rows = groupBannerRows([
      banner('wide', 'wide'),
      banner('half-a', 'half'),
      banner('half-b', 'half'),
      banner('half-c', 'half'),
      banner('wide-2', 'wide'),
    ]);
    expect(rows.map((row) => row.map((item) => item.id))).toEqual([
      ['wide'],
      ['half-a', 'half-b'],
      ['half-c'],
      ['wide-2'],
    ]);
  });
});
