'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Card } from '@/components/UI';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import { Button, FormLabel, Input } from '@/components/UI';
import { MovieCard } from '@/components/UI/Card/variants/Movie';
import { Icon } from '@/components/UI/Icon';
import { Separator } from '@/components/UI/Separator';
import { addMovie, deleteMovie, updateMovie } from '@/database/movies';
import { Movie } from '@/types/movie';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface MovieFormProps {
  movie_to_edit?: Movie;
}

const initial_movie_state: Movie = {
  id: '',
  slug: '',
  title: '',
  release_date: '',
  imdb_id: undefined,
  poster_url: undefined,
  imdb_link: undefined,
  rating: undefined,
};

const MovieForm: React.FC<MovieFormProps> = ({ movie_to_edit }) => {
  const [movie, set_movie] = useState<Movie>(
    movie_to_edit || initial_movie_state,
  );

  // Use a stable initial date to avoid infinite loops with useSyncExternalStore
  const [now] = useState(() => new Date());

  const initial_date = useMemo(() => {
    const date = movie_to_edit?.release_date
      ? new Date(movie_to_edit.release_date)
      : now;
    return date;
  }, [movie_to_edit, now]);

  const [selected_date, set_selected_date] = useState<Date>(initial_date);

  // Sync state if initial_date change
  useEffect(() => {
    set_selected_date(initial_date);
    if (movie_to_edit) {
      set_movie(movie_to_edit);
    }
  }, [initial_date, movie_to_edit]);

  const current_preview: Movie = {
    id: movie.id || 'preview',
    slug: movie.slug || 'preview',
    title: movie.title || 'Movie Title',
    release_date: movie.release_date || formatDate(selected_date),
    imdb_id: movie.imdb_id,
    image: movie.poster_url,
    poster_url: movie.poster_url,
    imdb_link: movie.imdb_link || '#',
    rating: movie.rating,
  };

  // IMDB search states
  const [query, set_query] = useState('');
  const [search_results, set_search_results] = useState<
    Record<string, unknown>[]
  >([]);
  const [search_loading, set_search_loading] = useState(false);
  const [search_error, set_search_error] = useState<string | null>(null);

  const perform_search = useCallback(async (q: string) => {
    if (!q || !q.trim()) return;
    set_search_loading(true);
    set_search_error(null);
    set_search_results([]);

    try {
      const encoded = encodeURIComponent(q.trim());
      const res = await fetch(
        `https://imdb.iamidiotareyoutoo.com/search?q=${encoded}`,
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      interface ImdbSearchResponse {
        description?: Record<string, unknown>[];
      }
      const data = (await res.json()) as ImdbSearchResponse;
      const list: Record<string, unknown>[] = Array.isArray(data?.description)
        ? (data.description as Record<string, unknown>[])
        : [];
      set_search_results(list);
    } catch (err) {
      set_search_error(err instanceof Error ? err.message : String(err));
    } finally {
      set_search_loading(false);
    }
  }, []);

  const get_string = (val: unknown) =>
    typeof val === 'string' ? val : typeof val === 'number' ? String(val) : '';

  const handle_select_result = (item: Record<string, unknown>) => {
    // Map fields from the API response to our Movie form safely
    const title = get_string(item['#TITLE'] ?? item['title'] ?? '');
    const year_str = get_string(item['#YEAR'] ?? item['year'] ?? '');
    const imdb_id = get_string(item['#IMDB_ID'] ?? item['imdb_id'] ?? '');
    const poster = get_string(item['#IMG_POSTER'] ?? item['poster'] ?? '');
    const imdb_url = get_string(
      item['#IMDB_URL'] ?? item['#IMDB_IV'] ?? item['imdb_url'] ?? '',
    );

    handle_change('title', title);
    handle_change('imdb_id', imdb_id);
    handle_change('poster_url', poster);
    handle_change('imdb_link', imdb_url);

    // Set selected date from year if available
    if (year_str) {
      const date = new Date(`${year_str}-01-01`);
      set_selected_date(date);
      handle_change('release_date', formatDate(date));
    }

    // Clear search results after selection
    set_search_results([]);
    set_query('');
  };

  const handle_change = (field: keyof Movie, value: Movie[keyof Movie]) => {
    set_movie((prev) => ({ ...prev, [field]: value }) as Movie);
  };

  const handle_date_change = (new_date: Date) => {
    set_selected_date(new_date);
    handle_change('release_date', formatDate(new_date));
  };

  const required_fields: { key: keyof Movie; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'release_date', label: 'Release Date' },
  ];

  const validate_form = () => {
    for (const field of required_fields) {
      const value = movie[field.key];
      const is_empty = typeof value === 'string' ? !value.trim() : !value;
      if (is_empty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validate_form()) return;

    const movie_data = {
      ...movie,
      id: movie_to_edit?.id || generateSlug(movie.title),
      release_date: formatDate(selected_date),
    } as Movie;

    try {
      const result = movie_to_edit
        ? await updateMovie(movie_data)
        : await addMovie(movie_data);
      if (result.success) {
        toast.success(
          movie_to_edit
            ? 'Movie updated successfully!'
            : 'Movie added successfully!',
        );
        router.push('/database/movies');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving movie: ${error.message}`
          : 'Unknown error',
      );
    }
  };

  const handle_delete = async () => {
    if (!movie_to_edit) return;
    try {
      const result = await deleteMovie(movie_to_edit.id);
      if (result.success) {
        toast.success('Movie deleted successfully!');
        router.push('/database/movies');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting movie: ${error.message}`
          : 'Unknown error',
      );
    }
  };

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete this movie? This action cannot be
          undone.
        </p>
        <div className='flex justify-center mb-6'>
          <MovieCard movie={current_preview} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handle_delete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  return (
    <>
      <div className='space-y-6'>
        <div className='flex justify-center'>
          <MovieCard movie={current_preview} isPreview />
        </div>

        <Separator margin='5' />

        {/* IMDB Search */}
        <div className='space-y-3'>
          <FormLabel htmlFor='imdb-search'>Search IMDB</FormLabel>
          <div className='flex gap-2'>
            <Input
              id='imdb-search'
              type='text'
              placeholder='Search IMDB (e.g., Titanic)'
              value={query || ''}
              onChange={(e) => set_query(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e?.preventDefault();
                  perform_search(query);
                }
              }}
            />
            <Button variant='primary' onClick={() => perform_search(query)}>
              {search_loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {search_error && (
            <p className='text-xs text-destructive'>{search_error}</p>
          )}

          {search_results.length > 0 && (
            <div className='grid grid-cols-1 gap-3'>
              {search_results.map((r, i) => {
                const poster = get_string(
                  r['#IMG_POSTER'] ?? r['poster'] ?? '',
                );
                const title = get_string(r['#TITLE'] ?? r['title'] ?? '');
                const year = get_string(r['#YEAR'] ?? r['year'] ?? '');
                const actors = get_string(r['#ACTORS'] ?? '');

                return (
                  <Card key={i} onClick={() => handle_select_result(r)}>
                    <div className='flex flex-1 items-center'>
                      <div className='flex-shrink-0 px-4.5 py-4'>
                        <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-muted dark:shadow-none '>
                          {poster ? (
                            <div className='h-16 w-11 flex-shrink-0 overflow-hidden rounded-md bg-muted dark:bg-card border border-border'>
                              <ImageWithFallback
                                width={44}
                                height={64}
                                src={poster}
                                alt={title}
                                className='h-full w-full object-cover'
                                loading='lazy'
                                type='portrait'
                                sizes='44px'
                              />
                            </div>
                          ) : (
                            <div className='h-16 w-11 flex-shrink-0 rounded-md bg-muted dark:bg-muted' />
                          )}
                        </div>
                      </div>
                      <div className='py-2 pr-4 space-y-1'>
                        <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-foreground'>
                          {title}
                        </p>
                        {actors && (
                          <p className='text-xs text-muted-foreground dark:text-muted-foreground mt-2 line-clamp-1'>
                            {actors}
                          </p>
                        )}
                        <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-muted-foreground lg:text-sm'>
                          Released {year}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Separator margin='5' />

        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={movie.title || ''}
              onChange={(e) => handle_change('title', e.target.value)}
              placeholder='Titanic'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='release_date' required>
              Release Date
            </FormLabel>
            <DateSelect
              value={selected_date}
              onChange={handle_date_change}
              mode='month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='imdb_id'>IMDB ID</FormLabel>
            <Input
              type='text'
              value={movie.imdb_id || ''}
              onChange={(e) => handle_change('imdb_id', e.target.value)}
              placeholder='e.g. tt0111161'
            />
          </div>
          <div>
            <FormLabel htmlFor='poster_url'>Poster URL</FormLabel>
            <Input
              type='text'
              value={movie.poster_url || ''}
              onChange={(e) => handle_change('poster_url', e.target.value)}
              placeholder='https://example.com/poster.jpg'
            />
          </div>
          <div>
            <FormLabel htmlFor='imdb_link'>IMDB Link</FormLabel>
            <Input
              type='text'
              value={movie.imdb_link || ''}
              onChange={(e) => handle_change('imdb_link', e.target.value)}
              placeholder='https://www.imdb.com/title/tt0111161/'
            />
          </div>
          <div>
            <FormLabel htmlFor='rating'>Rating</FormLabel>
            <div className='flex items-center gap-2'>
              {[1, 2, 3, 4, 5].map((i) => {
                const filled = (movie.rating || 0) >= i;
                return (
                  <button
                    key={i}
                    type='button'
                    onClick={() => handle_change('rating', i)}
                    onMouseDown={(e) => e?.preventDefault()}
                    className={`p-0.5 focus:outline-none cursor-pointer hover:scale-110 transition-transform ${filled ? 'text-gruv-yellow' : 'text-muted-foreground dark:text-muted-foreground'}`}
                    aria-label={`${i} star`}
                  >
                    <div className='w-4 h-4'>
                      <Icon name='star' />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {movie_to_edit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirm_delete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handle_submit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handle_submit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default MovieForm;
