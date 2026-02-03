'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { mapRecordToPersonalInfo } from '@/lib/mappers';
import { PersonalInfo } from '@/types/personal-info';

const defaultData: PersonalInfo = {
  name: 'Zulfikar',
  title: 'I build things for the web',
  avatar: '/avatar.jpg',
  avatar_url: '/avatar.jpg',
};

interface PersonalInfoRow {
  [key: string]: unknown;
  id: string;
  name: string;
  title: string;
  avatar_url: string;
}

/**
 * Uploads a file to R2 and returns the filename (key).
 */
async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage not available');

  const fileExt = file.name.split('.').pop() || 'png';
  const key = `profile/avatar.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return key;
}

/**
 * Fetches the personal info from the database.
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  try {
    const db = getDB();
    if (!db) return defaultData;

    const row = await db
      .prepare('SELECT * FROM personalInfo WHERE id = 1')
      .first<PersonalInfoRow>();

    if (!row) return defaultData;

    return mapRecordToPersonalInfo(row);
  } catch (e) {
    console.error('Error fetching personal info:', e);
    return defaultData;
  }
}

/**
 * Updates the personal info data.
 */
export async function updatePersonalInfo(
  data: PersonalInfo | FormData,
): Promise<{ success: boolean; data?: PersonalInfo; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('DB not available');

    let name: string;
    let title: string;
    let avatarKey: string | null = null;

    if (data instanceof FormData) {
      name = data.get('name') as string;
      title = data.get('title') as string;

      const avatarFile = data.get('avatar') as File;
      const avatarUrlInput = data.get('avatar_url') as string;

      if (avatarFile && avatarFile.size > 0) {
        // Priority 1: New file upload
        avatarKey = await uploadFile(avatarFile);
      } else if (avatarUrlInput) {
        // Priority 2: URL string provided
        // If it's one of our own storage URLs, just store the key
        avatarKey = avatarUrlInput.replace('/api/storage/', '');
      }
    } else {
      name = data.name;
      title = data.title;
      avatarKey = data.avatar_url
        ? data.avatar_url.replace('/api/storage/', '')
        : null;
    }

    // Upsert into singleton table
    await db
      .prepare(
        `INSERT INTO personalInfo (id, name, title, avatar_url)
       VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         title = excluded.title,
         avatar_url = COALESCE(excluded.avatar_url, personalInfo.avatar_url),
         updated_at = unixepoch()`,
      )
      .bind(name, title, avatarKey)
      .run();

    revalidatePath('/');
    revalidatePath('/database/personal-info');
    revalidateTag('profile', 'max');

    const updated = await getPersonalInfo();
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error('Update personal info error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
