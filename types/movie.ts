export interface Movie {
  id: string;
  title: string;
  releaseDate: string;
  imdbId?: string;
  posterUrl?: string;
  imdbLink?: string;
  rating?: number; // 1-5
}
