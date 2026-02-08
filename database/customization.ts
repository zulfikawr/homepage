'use server';

import { revalidatePath } from 'next/cache';

import { mapRecordToCustomization } from '@/lib/mappers';
import { CustomizationSettings } from '@/types/customization';

import { executeQueryFirst, executeUpdate, handleDatabaseError } from './base';

const defaultSettings: CustomizationSettings = {
  id: 1,
  default_theme: 'gruvbox-dark',
  default_background: 'none',
  updated_at: Math.floor(Date.now() / 1000),
};

export async function getCustomizationSettings(): Promise<CustomizationSettings> {
  try {
    const row = await executeQueryFirst(
      'SELECT * FROM customization_settings WHERE id = 1',
    );

    if (!row) return defaultSettings;

    return mapRecordToCustomization(row as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching customization settings:', error);
    return defaultSettings;
  }
}

export async function updateCustomizationSettings(
  data: Partial<CustomizationSettings>,
): Promise<{ success: boolean; data?: CustomizationSettings; error?: string }> {
  try {
    const current = await getCustomizationSettings();
    const default_theme = data.default_theme ?? current.default_theme;
    const default_background =
      data.default_background ?? current.default_background;

    await executeUpdate(
      `INSERT INTO customization_settings (id, default_theme, default_background)
       VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         default_theme = excluded.default_theme,
         default_background = excluded.default_background,
         updated_at = unixepoch()`,
      [default_theme, default_background],
    );

    revalidatePath('/');
    revalidatePath('/database/customization');

    const updated = await getCustomizationSettings();
    return { success: true, data: updated };
  } catch (error) {
    handleDatabaseError(error, 'update customization settings');
  }
}
