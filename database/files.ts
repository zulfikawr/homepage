'use server';

import { revalidatePath } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';

/**
 * Uploads a file to R2 and updates a database record.
 * (This is a generic helper used for legacy reasons or multi-purpose fields)
 */
export async function uploadFile(
  collectionName: string,
  recordId: string,
  fieldName: string,
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const db = getDB();
    const bucket = getBucket();
    const file = formData.get(fieldName) as File;
    if (!file || !db || !bucket)
      return { success: false, error: 'Config missing' };

    const key = `${collectionName}-${recordId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const url = `/api/storage/${key}`;

    // Map collection names to table names if they differ
    const tableMap: Record<string, string> = {
      profile: 'personal_info',
      reading_list: 'books',
    };
    const table = tableMap[collectionName] || collectionName;

    // Most tables use image_url or similar. This helper might need specific mapping
    // for every field in every table, but generally we use image_url or file_url now.
    const field =
      fieldName === 'image' || fieldName === 'poster' || fieldName === 'avatar'
        ? 'image_url'
        : fieldName;

    await db
      .prepare(`UPDATE ${table} SET ${field} = ? WHERE id = ?`)
      .bind(url, recordId)
      .run();

    revalidatePath(`/database/${collectionName}`);
    return { success: true, url };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
