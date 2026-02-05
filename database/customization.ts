'use server';

import { revalidatePath } from 'next/cache';

import { getDB } from '@/lib/cloudflare';
import { mapRecordToCustomization } from '@/lib/mappers';
import { CustomizationSettings } from '@/types/customization';

const defaultSettings: CustomizationSettings = {
  id: 1,
  default_theme: 'gruvbox-dark',
  default_background: 'none',
  updated_at: Math.floor(Date.now() / 1000),
};

/**
 * Fetches the customization settings from the database.
 */
export async function getCustomizationSettings(): Promise<CustomizationSettings> {
  try {
    const db = getDB();
    if (!db) return defaultSettings;

    const row = await db
      .prepare('SELECT * FROM customization_settings WHERE id = 1')
      .first();

    if (!row) return defaultSettings;

    return mapRecordToCustomization(row);
  } catch (e) {
    console.error('Error fetching customization settings:', e);
    return defaultSettings;
  }
}

/**
 * Updates the customization settings.
 */
export async function updateCustomizationSettings(
  data: Partial<CustomizationSettings>,
): Promise<{ success: boolean; data?: CustomizationSettings; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('DB not available');

    const current = await getCustomizationSettings();
    const default_theme = data.default_theme ?? current.default_theme;
    const default_background =
      data.default_background ?? current.default_background;

    await db
      .prepare(
        `INSERT INTO customization_settings (id, default_theme, default_background)
       VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         default_theme = excluded.default_theme,
         default_background = excluded.default_background,
         updated_at = unixepoch()`,
      )
      .bind(default_theme, default_background)
      .run();

    revalidatePath('/');
    revalidatePath('/database/customization');

    const updated = await getCustomizationSettings();
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error('Update customization settings error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
