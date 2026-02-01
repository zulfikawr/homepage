'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToMovie } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Movie } from '@/types/movie';

/**
 * Ensures the PocketBase client is authenticated for server-side operations
 * by loading the auth state from the request cookies.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
}

/**
 * Helper to clean movie data before sending to PocketBase.
 */
function cleanMovieData(
  data: Omit<Movie, 'id'> | Movie,
): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle posterUrl field
  if (typeof clean.posterUrl === 'string') {
    if (clean.posterUrl.includes('/api/files/')) {
      const parts = clean.posterUrl.split('/');
      clean.posterUrl = parts[parts.length - 1].split('?')[0];
    }
  }

  // Remove ID
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
}

/**
 * Fetches all movies from the database.
 * @returns Promise with array of movies.
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    const records = await pb
      .collection('movies')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToMovie);
  } catch {
    return [];
  }
}

/**
 * Adds a new movie to the database.
 * @param data Movie data without ID.
 * @returns Promise with operation result.
 */
export async function addMovie(
  data: Omit<Movie, 'id'> | FormData,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  await ensureAuth();
  try {
    const payload =
      data instanceof FormData
        ? data
        : (cleanMovieData(data) as Record<string, unknown>);
    const record = await pb.collection('movies').create<RecordModel>(payload);
    const movie = mapRecordToMovie(record);

    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');

    return { success: true, movie };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing movie in the database.
 * @param data Updated movie data.
 * @returns Promise with operation result.
 */
export async function updateMovie(
  data: Movie | FormData,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  await ensureAuth();
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      const formId = data.get('id') as string;
      if (formId) recordId = formId;
      else throw new Error('ID is required for update');

      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id;
      updateData = cleanMovieData(data);
    }

    if (recordId.length !== 15) {
      const records = await pb.collection('movies').getFullList<RecordModel>({
        filter: `slug = "${recordId}"`,
      });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('movies').getOne(recordId);
      } catch {
        const records = await pb.collection('movies').getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
        if (records.length > 0) recordId = records[0].id;
      }
    }

    const record = await pb
      .collection('movies')
      .update<RecordModel>(recordId, updateData);
    const movie = mapRecordToMovie(record);

    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');

    return { success: true, movie };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a movie from the database.
 * @param id ID or slug of the movie.
 * @returns Promise with operation result.
 */
export async function deleteMovie(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb.collection('movies').getFullList<RecordModel>({
        filter: `slug = "${id}"`,
      });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('movies').getOne(id);
      } catch {
        const records = await pb.collection('movies').getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('movies').delete(recordId);

    revalidatePath('/movies');
    revalidatePath('/database/movies');
    revalidateTag('movies', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single movie by ID or slug.
 */
export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb.collection('movies').getOne<RecordModel>(id);
        if (record) return mapRecordToMovie(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb.collection('movies').getFullList<RecordModel>({
      filter: `slug = "${id}"`,
      requestKey: null,
    });

    if (records.length > 0) {
      return mapRecordToMovie(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
