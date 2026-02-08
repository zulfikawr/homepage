'use server';

import { revalidatePath } from 'next/cache';

import { getBucket } from '@/lib/cloudflare';
import { mapRecordToResume } from '@/lib/mappers';
import { Resume } from '@/types/resume';

import { executeQueryFirst, executeUpdate } from './base';

async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage not available');

  const key = `profile/resume.pdf`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: 'application/pdf' },
  });

  return key;
}

export async function getResume(): Promise<Resume> {
  const defaultResume: Resume = { file: '', file_url: '' };
  try {
    const row = await executeQueryFirst('SELECT * FROM resume WHERE id = 1');

    if (!row) return defaultResume;

    return mapRecordToResume(row as Record<string, unknown>);
  } catch {
    return defaultResume;
  }
}

export async function updateResume(
  data: Resume | FormData,
): Promise<{ success: boolean; data?: Resume; error?: string }> {
  try {
    let fileUrl: string = '';

    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file && file.size > 0) {
        fileUrl = await uploadFile(file);
      } else {
        fileUrl =
          (data.get('file_url') as string) ||
          (data.get('fileUrl') as string) ||
          '';
      }
    } else {
      fileUrl = data.file_url;
    }

    fileUrl = fileUrl.replace('/api/storage/', '');

    await executeUpdate(
      `INSERT INTO resume (id, file_url) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET file_url = excluded.file_url, updated_at = unixepoch()`,
      [fileUrl],
    );

    revalidatePath('/database/resume');
    const updated = await getResume();
    return { success: true, data: updated };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
