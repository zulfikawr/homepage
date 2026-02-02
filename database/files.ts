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
    console.log('[uploadFile] Starting upload:', {
      collectionName,
      recordId,
      fieldName,
    });

    const db = getDB();
    const bucket = getBucket();
    const file = formData.get(fieldName) as File;

    if (!file || !db || !bucket) {
      console.error('[uploadFile] Missing dependencies:', {
        hasFile: !!file,
        hasDB: !!db,
        hasBucket: !!bucket,
      });
      return { success: false, error: 'Config missing' };
    }

    let key: string;

    // For posts, use proper directory structure: posts/{slug}/fieldName.ext
    if (collectionName === 'posts') {
      // Get the slug from the database
      const row = await db
        .prepare('SELECT slug FROM posts WHERE id = ?')
        .bind(recordId)
        .first<{ slug: string }>();

      console.log('[uploadFile] Found post slug:', row?.slug);

      if (!row?.slug) {
        return { success: false, error: 'Post slug not found' };
      }

      const fileExt = file.name.split('.').pop() || 'bin';
      key = `posts/${row.slug}/${fieldName}.${fileExt}`;
    } else if (collectionName === 'resume') {
      // Resume uses fixed path: profile/resume.pdf
      key = 'profile/resume.pdf';
    } else {
      // Legacy format for other collections
      key = `${collectionName}-${recordId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    }

    console.log('[uploadFile] Uploading to R2 with key:', key);
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });
    console.log('[uploadFile] R2 upload successful');

    const url = `/api/storage/${key}`;

    // Map collection names to table names if they differ
    const tableMap: Record<string, string> = {
      profile: 'personal_info',
      reading_list: 'books',
    };
    const table = tableMap[collectionName] || collectionName;

    // Most tables use image_url or similar. This helper might need specific mapping
    // for every field in every table, but generally we use image_url or file_url now.
    let field: string;
    if (fieldName === 'image' || fieldName === 'poster') {
      field = 'image_url';
    } else if (fieldName === 'avatar') {
      field = 'avatar_url';
    } else if (fieldName === 'audio') {
      field = 'audio_url';
    } else {
      field = fieldName;
    }

    console.log('[uploadFile] Updating database:', {
      table,
      field,
      key,
      recordId,
    });
    await db
      .prepare(`UPDATE ${table} SET ${field} = ? WHERE id = ?`)
      .bind(key, recordId)
      .run();
    console.log('[uploadFile] Database updated successfully');

    revalidatePath(`/database/${collectionName}`);
    return { success: true, url };
  } catch (e) {
    console.error('[uploadFile] Error:', e);
    return { success: false, error: String(e) };
  }
}
