import pb from '@/lib/pocketbase';
import { Movie } from '@/types/movie';

/**
 * Fetches and subscribes to movies data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function moviesData(callback: (data: Movie[]) => void) {
  const fetchAll = async () => {
    try {
      const data = await pb
        .collection('movies')
        .getFullList<Movie>({ sort: '-created' });
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('movies').subscribe('*', fetchAll);

  return () => pb.collection('movies').unsubscribe();
}

/**
 * Fetches all movies from the database.
 * @returns Promise with array of movies.
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    return await pb
      .collection('movies')
      .getFullList<Movie>({ sort: '-created' });
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
    const record = await pb.collection('movies').create<Movie>(data);
    return { success: true, movie: record };
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
    if (id.length !== 15) {
      const record = await pb
        .collection('movies')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    const record = await pb.collection('movies').update<Movie>(recordId, rest);
    return { success: true, movie: record };
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
 * @param id ID or slug of the movie.
 * @returns Promise with the movie data or null.
 */
export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    if (id.length === 15) {
      return await pb.collection('movies').getOne<Movie>(id);
    }
    return await pb
      .collection('movies')
      .getFirstListItem<Movie>(`slug="${id}"`);
  } catch {
    return null;
  }
}
