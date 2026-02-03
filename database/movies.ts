'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Movie } from '@/types/movie';

interface MovieRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  release_date: string;
  imdb_id: string;
  poster_url: string;
  imdb_link: string;
  rating: number;
}

function mapRowToMovie(row: MovieRow | null): Movie | null {
  if (!row) return null;
  const posterKey = row.poster_url;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    release_date: row.release_date,
    imdb_id: row.imdb_id,
    image: posterKey ? `/api/storage/${posterKey}` : '',
    poster_url: posterKey || '',
    imdb_link: row.imdb_link,
    rating: row.rating,
  };
}

async function uploadFile(file: File, slug: string): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');

  const fileExt = file.name.split('.').pop() || 'jpg';
  const key = `movies/${slug}/poster.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });
  return key;
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const db = getDB();
    if (!db) return [];
    const { results } = await db
      .prepare('SELECT * FROM movies ORDER BY created_at DESC')
      .all<MovieRow>();
    return results.map(mapRowToMovie).filter((m): m is Movie => m !== null);
  } catch (error) {
    console.error('[Database] Failed to fetch movies:', error);
    return [];
  }
}

export async function addMovie(
  data: Omit<Movie, 'id'> | FormData,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const id = crypto.randomUUID();
    let payload: Partial<Movie> = {};

    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.release_date = data.get('release_date') as string;
      payload.imdb_id = data.get('imdb_id') as string;
      payload.imdb_link = data.get('imdb_link') as string;
      payload.rating = Number(data.get('rating'));

      // Generate slug first if not provided
      if (!payload.slug) {
        payload.slug =
          payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
      }

      const posterFile = data.get('image') as File | null;
      const posterUrlInput = data.get('poster_url') as string | null;
      if (posterFile && posterFile.size > 0) {
        payload.poster_url = await uploadFile(posterFile, payload.slug);
      } else if (posterUrlInput) {
        payload.poster_url = posterUrlInput.replace('/api/storage/', '');
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
        `INSERT INTO movies (id, slug, title, release_date, imdb_id, poster_url, imdb_link, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.title,
        payload.release_date || '',
        payload.imdb_id || '',
        payload.poster_url || '',
        payload.imdb_link || '',
        payload.rating || 0,
      )
      .run();

    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');

    const newMovie = await getMovieById(id);
    if (!newMovie) throw new Error('Failed to retrieve movie after creation');

    return { success: true, movie: newMovie };
  } catch (error) {
    console.error('[Database] Failed to add movie:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateMovie(
  data: Movie | FormData,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    let recordId =
      data instanceof FormData ? (data.get('id') as string) : data.id;
    const existing = await getMovieById(recordId);
    if (!existing) return { success: false, error: 'Movie not found' };
    recordId = existing.id;

    let payload: Partial<Movie> = {};
    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.release_date = data.get('release_date') as string;
      payload.imdb_id = data.get('imdb_id') as string;
      payload.imdb_link = data.get('imdb_link') as string;
      payload.rating = Number(data.get('rating'));

      // Use existing slug or new one
      const slug = payload.slug || existing.slug;

      const posterFile = data.get('image') as File | null;
      const posterUrlInput = data.get('poster_url') as string | null;
      if (posterFile && posterFile.size > 0) {
        payload.poster_url = await uploadFile(posterFile, slug);
      } else if (posterUrlInput) {
        payload.poster_url = posterUrlInput.replace('/api/storage/', '');
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
    if (payload.release_date !== undefined) {
      fields.push('release_date = ?');
      values.push(payload.release_date);
    }
    if (payload.imdb_id !== undefined) {
      fields.push('imdb_id = ?');
      values.push(payload.imdb_id);
    }
    if (payload.imdb_link !== undefined) {
      fields.push('imdb_link = ?');
      values.push(payload.imdb_link);
    }
    if (payload.rating !== undefined) {
      fields.push('rating = ?');
      values.push(payload.rating);
    }
    if (payload.poster_url !== undefined) {
      fields.push('poster_url = ?');
      values.push(payload.poster_url);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE movies SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');

    const updated = await getMovieById(recordId);
    if (!updated) throw new Error('Failed to retrieve movie after update');

    return { success: true, movie: updated };
  } catch (error) {
    console.error('[Database] Failed to update movie:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteMovie(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const existing = await getMovieById(id);
    if (!existing) return { success: false, error: 'Movie not found' };
    await db.prepare('DELETE FROM movies WHERE id = ?').bind(existing.id).run();
    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');
    return { success: true };
  } catch (error) {
    console.error('[Database] Failed to delete movie:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const db = getDB();
    if (!db) return null;
    const row = await db
      .prepare('SELECT * FROM movies WHERE id = ? OR slug = ?')
      .bind(id, id)
      .first<MovieRow>();
    return mapRowToMovie(row);
  } catch (error) {
    console.error('[Database] Failed to get movie by ID:', error);
    return null;
  }
}
