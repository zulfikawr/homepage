'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import {
  BANNER_DEFINITIONS,
  BannerSetting,
  BannerWidth,
  DEFAULT_BANNER_SETTINGS,
  isBannerWidth,
} from '@/lib/banner-config';

import { executeQuery, executeUpdate } from './base';

interface BannerSettingRow {
  id: string;
  width: string;
  sort_order: number;
}

const normalizeWidth = (
  value: string | undefined,
  fallback: BannerWidth,
): BannerWidth => (isBannerWidth(value) ? value : fallback);

export async function getBannerSettings(): Promise<BannerSetting[]> {
  try {
    const rows = await executeQuery<BannerSettingRow>(
      'SELECT id, width, sort_order FROM banner_settings',
    );
    const rowMap = new Map(rows.map((row) => [row.id, row]));

    const settings = BANNER_DEFINITIONS.map((banner, index) => {
      const row = rowMap.get(banner.id);
      return {
        id: banner.id,
        title: banner.title,
        width: normalizeWidth(row?.width, banner.defaultWidth),
        order: row?.sort_order ?? index,
      };
    });

    return settings.sort(
      (a, b) =>
        a.order - b.order ||
        BANNER_DEFINITIONS.findIndex((item) => item.id === a.id) -
          BANNER_DEFINITIONS.findIndex((item) => item.id === b.id),
    );
  } catch {
    // The table may not exist on an older local database yet.
    return DEFAULT_BANNER_SETTINGS;
  }
}

export async function updateBannerSetting(data: {
  id: string;
  width?: BannerWidth;
  order?: number;
}): Promise<{ success: boolean; settings?: BannerSetting[]; error?: string }> {
  try {
    const definition = BANNER_DEFINITIONS.find(
      (banner) => banner.id === data.id,
    );
    if (!definition) return { success: false, error: 'Unknown banner' };

    const current = await getBannerSettings();
    const existing = current.find((banner) => banner.id === data.id);
    const width = isBannerWidth(data.width)
      ? data.width
      : (existing?.width ?? definition.defaultWidth);
    const order =
      typeof data.order === 'number' && Number.isFinite(data.order)
        ? data.order
        : (existing?.order ??
          BANNER_DEFINITIONS.findIndex((banner) => banner.id === data.id));

    await executeUpdate(
      `INSERT INTO banner_settings (id, width, sort_order)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         width = excluded.width,
         sort_order = excluded.sort_order,
         updated_at = unixepoch()`,
      [data.id, width, order],
    );

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('banner-settings', 'max');

    return { success: true, settings: await getBannerSettings() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
