import { generateId } from '@/utilities/generateId';
import { database, ref, get, set, remove, onValue } from '@/lib/firebase';
import { Movie } from '@/types/movie';

export function moviesData(callback: (data: Movie[]) => void) {
  const moviesRef = ref(database, 'movies');

  return onValue(moviesRef, (snapshot) => {
    const data = snapshot.exists()
      ? Object.entries(snapshot.val()).map(
          ([id, movie]: [string, Omit<Movie, 'id'>]) => ({ id, ...movie }),
        )
      : [];
    callback(data);
  });
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const moviesRef = ref(database, 'movies');
    const snapshot = await get(moviesRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const movies = Object.entries(data).map(
        ([id, m]: [string, Omit<Movie, 'id'>]) => ({ id, ...m }),
      );
      return movies;
    }

    return [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
}

export async function addMovie(
  data: Omit<Movie, 'id'>,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const { title, releaseDate, posterUrl, imdbId, imdbLink, rating } = data;

    if (!title || !releaseDate) {
      return { success: false, error: 'Missing required fields' };
    }

    const newMovie: Movie = {
      id: generateId(title),
      title,
      releaseDate,
      posterUrl,
      imdbId,
      imdbLink,
    };

    // Only include rating if it's defined (Firebase disallows undefined values)
    if (typeof rating !== 'undefined') {
      (newMovie as Movie).rating = rating;
    }

    const newRef = ref(database, `movies/${newMovie.id}`);
    await set(newRef, newMovie);

    return { success: true, movie: newMovie };
  } catch (error) {
    console.error('Error adding movie:', error);
    return { success: false, error: 'Failed to add movie' };
  }
}

export async function updateMovie(
  data: Movie,
): Promise<{ success: boolean; movie?: Movie; error?: string }> {
  try {
    const { id, title, releaseDate, posterUrl, imdbId, imdbLink, rating } =
      data;

    if (!id || !title || !releaseDate) {
      return { success: false, error: 'Missing required fields' };
    }

    const updated: Movie = {
      id,
      title,
      releaseDate,
      posterUrl,
      imdbId,
      imdbLink,
    };

    // Only attach rating if it's provided
    if (typeof rating !== 'undefined') {
      (updated as Movie).rating = rating;
    }

    const refPath = ref(database, `movies/${id}`);
    await set(refPath, updated);

    return { success: true, movie: updated };
  } catch (error) {
    console.error('Error updating movie:', error);
    return { success: false, error: 'Failed to update movie' };
  }
}

export async function deleteMovie(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) return { success: false, error: 'Movie ID is required' };

    const refPath = ref(database, `movies/${id}`);
    await remove(refPath);

    return { success: true };
  } catch (error) {
    console.error('Error deleting movie:', error);
    return { success: false, error: 'Failed to delete movie' };
  }
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    if (!id) throw new Error('Movie ID is required');

    const refPath = ref(database, `movies/${id}`);
    const snapshot = await get(refPath);
    if (!snapshot.exists()) return null;
    const data = snapshot.val();
    return { id, ...data };
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    return null;
  }
}
