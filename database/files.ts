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
    } else if (
      collectionName === 'projects' ||
      collectionName === 'employments' ||
      collectionName === 'movies' ||
      collectionName === 'books' ||
      collectionName === 'publications'
    ) {
      // Use slug for collections that have it
      const row = await db
        .prepare(`SELECT slug FROM ${collectionName} WHERE id = ?`)
        .bind(recordId)
        .first<{ slug: string }>();

      if (!row?.slug) {
        return { success: false, error: `${collectionName} slug not found` };
      }

      const fileExt = file.name.split('.').pop() || 'bin';
      key = `${collectionName}/${row.slug}/${fieldName}.${fileExt}`;
    } else if (collectionName === 'certificates') {
      // Certificates directory
      const row = await db
        .prepare(`SELECT slug FROM certificates WHERE id = ?`)
        .bind(recordId)
        .first<{ slug: string }>();

      const folder = row?.slug || recordId;
      const fileExt = file.name.split('.').pop() || 'bin';
      key = `certificates/${folder}/${fieldName}.${fileExt}`;
    } else if (
      collectionName === 'personalInfo' ||
      collectionName === 'profile'
    ) {
      const fileExt = file.name.split('.').pop() || 'bin';
      key = `profile/${fieldName}.${fileExt}`;
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
      profile: 'personalInfo',
      readingList: 'books',
    };
    const table = tableMap[collectionName] || collectionName;

    const fieldMap: Record<string, string> = {
      image: 'image_url',
      poster: 'poster_url',
      avatar: 'avatar_url',
      audio: 'audioUrl',
      logo: 'organization_logo_url',
      organizationLogo: 'organization_logo_url',
      organization_logo_url: 'organization_logo_url',
      favicon: 'favicon_url',
      file: 'fileUrl',
      fileUrl: 'fileUrl',
    };

    const field = fieldMap[fieldName] || fieldName;

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
