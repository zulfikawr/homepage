'use server';

import { revalidatePath } from 'next/cache';

import { getBucket } from '@/lib/cloudflare';

import { executeQueryFirst, executeUpdate } from './base';

export async function uploadFile(
  collectionName: string,
  recordId: string,
  fieldName: string,
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const bucket = getBucket();
    const file = formData.get(fieldName) as File;

    if (!file || !bucket) {
      return { success: false, error: 'Config missing' };
    }

    let key: string;

    if (collectionName === 'posts') {
      const row = await executeQueryFirst<{ slug: string }>(
        'SELECT slug FROM posts WHERE id = ?',
        [recordId],
      );

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
      const row = await executeQueryFirst<{ slug: string }>(
        `SELECT slug FROM ${collectionName} WHERE id = ?`,
        [recordId],
      );

      if (!row?.slug) {
        return { success: false, error: `${collectionName} slug not found` };
      }

      const fileExt = file.name.split('.').pop() || 'bin';
      key = `${collectionName}/${row.slug}/${fieldName}.${fileExt}`;
    } else if (collectionName === 'certificates') {
      const row = await executeQueryFirst<{ slug: string }>(
        `SELECT slug FROM certificates WHERE id = ?`,
        [recordId],
      );

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
      key = 'profile/resume.pdf';
    } else {
      key = `${collectionName}-${recordId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    }

    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const url = `/api/storage/${key}`;

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

    await executeUpdate(`UPDATE ${table} SET ${field} = ? WHERE id = ?`, [
      key,
      recordId,
    ]);

    revalidatePath(`/database/${collectionName}`);
    return { success: true, url };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
