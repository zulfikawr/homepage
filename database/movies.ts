'use server';

import pb from '@/lib/pocketbase';
import { Movie } from '@/types/movie';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToMovie } from './movies.client';

/**
 * Fetches all movies from the database.
 * @returns Promise with array of movies.
 */
export async function getMovies(): Promise<Movie[]> {
  'use cache';
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
  data: Omit<Movie, 'id'>,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const record = await pb.collection('movies').create<RecordModel>(data);
    const movie = mapRecordToMovie(record);
    try {
      revalidateTag('movies', 'max');
    } catch {
      // Ignore
    }
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
  data: Movie,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      try {
        const record = await pb
          .collection('movies')
          .getFirstListItem(`slug="${recordId}"`);
        recordId = record.id;
      } catch {
        // Ignore
      }
    }

    const record = await pb
      .collection('movies')
      .update<RecordModel>(recordId, rest);
    const movie = mapRecordToMovie(record);
    try {
      revalidateTag('movies', 'max');
    } catch {
      // Ignore
    }
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
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('movies')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('movies').delete(recordId);
    try {
      revalidateTag('movies', 'max');
    } catch {
      // Ignore
    }
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
  'use cache';
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
