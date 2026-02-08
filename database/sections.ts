'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { Section } from '@/types/section';

import { executeQuery, executeUpdate } from './base';

interface SectionRow {
  id: string;
  name: string;
  title: string;
  enabled: number;
  sort_order: number;
}

function mapRowToSection(row: SectionRow): Section {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    enabled: !!row.enabled,
    order: row.sort_order,
  };
}

export async function getSections(): Promise<Section[]> {
  try {
    const results = await executeQuery<SectionRow>(
      'SELECT * FROM sections ORDER BY sort_order ASC',
    );
    return results.map(mapRowToSection);
  } catch (e) {
    console.error('Error fetching sections:', e);
    return [];
  }
}

export async function createSection(
  data: Omit<Section, 'id'>,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    const id = crypto.randomUUID();

    await executeUpdate(
      `INSERT INTO sections (id, name, title, enabled, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.title, data.enabled ? 1 : 0, data.order],
    );

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

    return { success: true, section: { ...data, id } };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateSection(
  data: (Partial<Section> & { id: string }) | FormData,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    let recordId: string;
    let payload: Partial<Section> = {};

    if (data instanceof FormData) {
      recordId = data.get('id') as string;
      if (data.has('name')) payload.name = data.get('name') as string;
      if (data.has('title')) payload.title = data.get('title') as string;
      if (data.has('enabled')) {
        const enabled = data.get('enabled');
        payload.enabled = enabled === 'true' || enabled === '1';
      }
      if (data.has('order')) {
        payload.order = Number(data.get('order'));
      }
    } else {
      recordId = data.id;
      payload = { ...data };
    }

    if (!recordId) return { success: false, error: 'ID required' };

    const fields: string[] = [];
    const values: (string | number | boolean | null | undefined)[] = [];

    if (payload.name !== undefined) {
      fields.push('name = ?');
      values.push(payload.name);
    }
    if (payload.title !== undefined) {
      fields.push('title = ?');
      values.push(payload.title);
    }
    if (payload.enabled !== undefined) {
      fields.push('enabled = ?');
      values.push(payload.enabled ? 1 : 0);
    }
    if (payload.order !== undefined) {
      fields.push('sort_order = ?');
      values.push(payload.order);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await executeUpdate(
        `UPDATE sections SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );
    }

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

    const sections = await getSections();
    const updated = sections.find((s) => s.id === recordId);

    return { success: true, section: updated };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteSection(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await executeUpdate('DELETE FROM sections WHERE id = ?', [id]);

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
