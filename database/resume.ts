'use server';

import { revalidatePath } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Resume } from '@/types/resume';

interface ResumeRow {
  file_url: string;
}

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

  return `/api/storage/${key}`;
}

export async function getResume(): Promise<Resume> {
  try {
    const db = getDB();
    if (!db) return { fileUrl: '' };
    const row = await db
      .prepare('SELECT * FROM resume WHERE id = 1')
      .first<ResumeRow>();
    return { fileUrl: row?.file_url || '' };
  } catch {
    return { fileUrl: '' };
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

    let fileUrl: string = '';

    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file && file.size > 0) {
        console.log('updateResume: Uploading file...', file.name, file.size);
        fileUrl = await uploadFile(file);
      } else {
        fileUrl = (data.get('fileUrl') as string) || '';
      }
    } else {
      fileUrl = data.fileUrl;
    }

    console.log('updateResume: Saving fileUrl to D1:', fileUrl);

    await db
      .prepare(
        `INSERT INTO resume (id, file_url) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET file_url = excluded.file_url, updated_at = unixepoch()`,
      )
      .bind(fileUrl)
      .run();

    revalidatePath('/database/resume');
    return { success: true, data: { fileUrl } };
  } catch (e) {
    console.error('updateResume Error:', e);
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
