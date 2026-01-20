import pb from '@/lib/pocketbase';
import { Movie } from '@/types/movie';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Movie object.
 */
export function mapRecordToMovie(record: RecordModel): Movie {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    releaseDate: record.releaseDate,
    imdbId: record.imdbId,
    posterUrl: record.posterUrl,
    imdbLink: record.imdbLink,
    rating: record.rating,
  };
}

/**
 * Fetches and subscribes to movies data.
 */
export function moviesData(callback: (data: Movie[]) => void) {
  const fetchAll = async () => {
    try {
      const records = await pb
        .collection('movies')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToMovie));
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('movies').subscribe('*', fetchAll);

  return () => pb.collection('movies').unsubscribe();
}
