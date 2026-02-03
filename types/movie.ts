export interface Movie {
  id: string;
  slug: string;
  title: string;
  release_date: string;
  imdb_id?: string;
  image?: string;
  poster_url?: string;
  imdb_link?: string;
  rating?: number;
}
