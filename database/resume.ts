'use server';

import { revalidatePath } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { mapRecordToResume } from '@/lib/mappers';
import { Resume } from '@/types/resume';

async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) {
    console.error('uploadFile: Bucket binding not found');
    throw new Error('Storage not available');
  }

  const key = `profile/resume.pdf`;
  const arrayBuffer = await file.arrayBuffer();

  try {
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: 'application/pdf' },
    });
  } catch (err) {
    console.error('uploadFile: R2 error:', err);
    throw err;
  }

  return key;
}

export async function getResume(): Promise<Resume> {
  const defaultResume: Resume = { file: '', file_url: '' };
  try {
    const db = getDB();
    if (!db) return defaultResume;

    const row = await db
      .prepare('SELECT * FROM resume WHERE id = 1')
      .first<Record<string, unknown>>();

    if (!row) return defaultResume;

    return mapRecordToResume(row);
  } catch {
    return defaultResume;
  }
}

export async function updateResume(
  data: Resume | FormData,
): Promise<{ success: boolean; data?: Resume; error?: string }> {
  try {
    const db = getDB();
    if (!db) {
      console.error('updateResume: DB binding not found');
      return { success: false, error: 'Database binding not found' };
    }

    let file_url: string = '';

    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file && file.size > 0) {
        console.log('updateResume: Uploading file...', file.name, file.size);
        file_url = await uploadFile(file);
      } else {
        file_url = (data.get('file_url') as string) || '';
      }
    } else {
      file_url = data.file_url;
    }

    // Clean the URL to just the key if it's our API URL
    file_url = file_url.replace('/api/storage/', '');

    console.log('updateResume: Saving file_url to D1:', file_url);

    await db
      .prepare(
        `INSERT INTO resume (id, file_url) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET file_url = excluded.file_url, updated_at = unixepoch()`,
      )
      .bind(file_url)
      .run();

    revalidatePath('/database/resume');
    const updated = await getResume();
    return { success: true, data: updated };
  } catch (e) {
    console.error('updateResume Error:', e);
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
