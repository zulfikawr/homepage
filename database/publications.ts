'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getDB } from '@/lib/cloudflare';
import { Publication } from '@/types/publication';

interface PublicationRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  authors: string;
  publisher: string;
  excerpt: string;
  keywords: string;
  open_access: number;
  link: string;
}

function mapRowToPublication(row: PublicationRow | null): Publication | null {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    authors: row.authors ? JSON.parse(row.authors) : [],
    publisher: row.publisher,
    excerpt: row.excerpt,
    keywords: row.keywords ? JSON.parse(row.keywords) : [],
    open_access: !!row.open_access,
    link: row.link,
  };
}

export async function getPublications(): Promise<Publication[]> {
  try {
    const db = getDB();
    if (!db) return [];
    const { results } = await db
      .prepare('SELECT * FROM publications ORDER BY created_at DESC')
      .all<PublicationRow>();
    return results
      .map(mapRowToPublication)
      .filter((p): p is Publication => p !== null);
  } catch (error) {
    console.error('[Database] Failed to fetch publications:', error);
    return [];
  }
}

export async function createPublication(
  data: Omit<Publication, 'id'> | FormData,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const id = crypto.randomUUID();
    let payload: Partial<Publication> = {};

    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.publisher = data.get('publisher') as string;
      payload.excerpt = data.get('excerpt') as string;
      payload.link = data.get('link') as string;
      payload.open_access = data.get('open_access') === 'true';
      const authorsStr = data.get('authors') as string;
      try {
        payload.authors = JSON.parse(authorsStr);
      } catch {
        payload.authors = [];
      }
      const keywordsStr = data.get('keywords') as string;
      try {
        payload.keywords = JSON.parse(keywordsStr);
      } catch {
        payload.keywords = [];
      }
    } else {
      payload = { ...data };
    }

    if (!payload.slug) {
      payload.slug =
        payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
    }

    await db
      .prepare(
        `INSERT INTO publications (id, slug, title, authors, publisher, excerpt, keywords, open_access, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.title,
        JSON.stringify(payload.authors || []),
        payload.publisher,
        payload.excerpt,
        JSON.stringify(payload.keywords || []),
        payload.open_access ? 1 : 0,
        payload.link || '',
      )
      .run();

    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');

    const newPub = await getPublicationById(id);
    if (!newPub)
      throw new Error('Failed to retrieve publication after creation');

    return { success: true, publication: newPub };
  } catch (error) {
    console.error('[Database] Failed to add publication:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updatePublication(
  data: Publication | FormData,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    let recordId =
      data instanceof FormData ? (data.get('id') as string) : data.id;
    const existing = await getPublicationById(recordId);
    if (!existing) return { success: false, error: 'Publication not found' };
    recordId = existing.id;

    let payload: Partial<Publication> = {};
    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.publisher = data.get('publisher') as string;
      payload.excerpt = data.get('excerpt') as string;
      payload.link = data.get('link') as string;
      payload.open_access = data.get('open_access') === 'true';
      const authorsStr = data.get('authors') as string;
      if (authorsStr) {
        try {
          payload.authors = JSON.parse(authorsStr);
        } catch {
          payload.authors = [];
        }
      }
      const keywordsStr = data.get('keywords') as string;
      if (keywordsStr) {
        try {
          payload.keywords = JSON.parse(keywordsStr);
        } catch {
          payload.keywords = [];
        }
      }
    } else {
      payload = { ...data };
    }

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    if (payload.title !== undefined) {
      fields.push('title = ?');
      values.push(payload.title);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.publisher !== undefined) {
      fields.push('publisher = ?');
      values.push(payload.publisher);
    }
    if (payload.excerpt !== undefined) {
      fields.push('excerpt = ?');
      values.push(payload.excerpt);
    }
    if (payload.link !== undefined) {
      fields.push('link = ?');
      values.push(payload.link);
    }
    if (payload.open_access !== undefined) {
      fields.push('open_access = ?');
      values.push(payload.open_access ? 1 : 0);
    }
    if (payload.authors !== undefined) {
      fields.push('authors = ?');
      values.push(JSON.stringify(payload.authors));
    }
    if (payload.keywords !== undefined) {
      fields.push('keywords = ?');
      values.push(JSON.stringify(payload.keywords));
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE publications SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');

    const updated = await getPublicationById(recordId);
    if (!updated)
      throw new Error('Failed to retrieve publication after update');

    return { success: true, publication: updated };
  } catch (error) {
    console.error('[Database] Failed to update publication:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deletePublication(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const existing = await getPublicationById(id);
    if (!existing) return { success: false, error: 'Publication not found' };
    await db
      .prepare('DELETE FROM publications WHERE id = ?')
      .bind(existing.id)
      .run();
    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');
    return { success: true };
  } catch (error) {
    console.error('[Database] Failed to delete publication:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getPublicationById(
  id: string,
): Promise<Publication | null> {
  try {
    const db = getDB();
    if (!db) return null;
    const row = await db
      .prepare('SELECT * FROM publications WHERE id = ? OR slug = ?')
      .bind(id, id)
      .first<PublicationRow>();
    return mapRowToPublication(row);
  } catch (error) {
    console.error('[Database] Failed to get publication by ID:', error);
    return null;
  }
}
