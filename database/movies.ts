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
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    releaseDate: row.release_date,
    imdbId: row.imdb_id,
    posterUrl: row.poster_url,
    imdbLink: row.imdb_link,
    rating: row.rating,
  };
}

async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');
  const key = `movie-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });
  return `/api/storage/${key}`;
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
      payload.releaseDate = data.get('releaseDate') as string;
      payload.imdbId = data.get('imdbId') as string;
      payload.imdbLink = data.get('imdbLink') as string;
      payload.rating = Number(data.get('rating'));
      const posterFile = data.get('poster') as File | null;
      const posterUrlInput = data.get('posterUrl') as string | null;
      if (posterFile && posterFile.size > 0) {
        payload.posterUrl = await uploadFile(posterFile);
      } else if (posterUrlInput) {
        payload.posterUrl = posterUrlInput.replace('/api/storage/', '');
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
        payload.releaseDate || '',
        payload.imdbId || '',
        payload.posterUrl || '',
        payload.imdbLink || '',
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
      payload.releaseDate = data.get('releaseDate') as string;
      payload.imdbId = data.get('imdbId') as string;
      payload.imdbLink = data.get('imdbLink') as string;
      payload.rating = Number(data.get('rating'));
      const posterFile = data.get('poster') as File | null;
      const posterUrlInput = data.get('posterUrl') as string | null;
      if (posterFile && posterFile.size > 0) {
        payload.posterUrl = await uploadFile(posterFile);
      } else if (posterUrlInput) {
        payload.posterUrl = posterUrlInput.replace('/api/storage/', '');
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
    if (payload.releaseDate !== undefined) {
      fields.push('release_date = ?');
      values.push(payload.releaseDate);
    }
    if (payload.imdbId !== undefined) {
      fields.push('imdb_id = ?');
      values.push(payload.imdbId);
    }
    if (payload.imdbLink !== undefined) {
      fields.push('imdb_link = ?');
      values.push(payload.imdbLink);
    }
    if (payload.rating !== undefined) {
      fields.push('rating = ?');
      values.push(payload.rating);
    }
    if (payload.posterUrl !== undefined) {
      fields.push('poster_url = ?');
      values.push(payload.posterUrl);
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
