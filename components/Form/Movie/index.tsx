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
import MovieCard from '@/components/UI/Card/variants/Movie';
import { Icon } from '@/components/UI/Icon';
import { Separator } from '@/components/UI/Separator';
import { addMovie, deleteMovie, updateMovie } from '@/database/movies';
import { Movie } from '@/types/movie';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface MovieFormProps {
  movieToEdit?: Movie;
}

const initialMovieState: Movie = {
  id: '',
  slug: '',
  title: '',
  releaseDate: '',
  imdbId: undefined,
  posterUrl: undefined,
  imdbLink: undefined,
  rating: undefined,
};

const MovieForm: React.FC<MovieFormProps> = ({ movieToEdit }) => {
  const [movie, setMovie] = useState<Movie>(movieToEdit || initialMovieState);

  // Use a stable initial date to avoid infinite loops with useSyncExternalStore
  const [now] = useState(() => new Date());

  const initialDate = useMemo(() => {
    const date = movieToEdit?.releaseDate
      ? new Date(movieToEdit.releaseDate)
      : now;
    return date;
  }, [movieToEdit, now]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  // Sync state if initialDate change
  useEffect(() => {
    setSelectedDate(initialDate);
    if (movieToEdit) {
      setMovie(movieToEdit);
    }
  }, [initialDate, movieToEdit]);

  const currentPreview: Movie = {
    id: movie.id || 'preview',
    slug: movie.slug || 'preview',
    title: movie.title || 'Movie Title',
    releaseDate: movie.releaseDate || formatDate(selectedDate),
    imdbId: movie.imdbId,
    posterUrl: movie.posterUrl,
    imdbLink: movie.imdbLink || '#',
    rating: movie.rating,
  };

  // IMDB search states
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>(
    [],
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = useCallback(async (q: string) => {
    if (!q || !q.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);

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
      setSearchResults(list);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : String(err));
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const getString = (val: unknown) =>
    typeof val === 'string' ? val : typeof val === 'number' ? String(val) : '';

  const handleSelectResult = (item: Record<string, unknown>) => {
    // Map fields from the API response to our Movie form safely
    const title = getString(item['#TITLE'] ?? item['title'] ?? '');
    const yearStr = getString(item['#YEAR'] ?? item['year'] ?? '');
    const imdbId = getString(item['#IMDB_ID'] ?? item['imdb_id'] ?? '');
    const poster = getString(item['#IMG_POSTER'] ?? item['poster'] ?? '');
    const imdbUrl = getString(
      item['#IMDB_URL'] ?? item['#IMDB_IV'] ?? item['imdb_url'] ?? '',
    );

    handleChange('title', title);
    handleChange('imdbId', imdbId);
    handleChange('posterUrl', poster);
    handleChange('imdbLink', imdbUrl);

    // Set selected date from year if available
    if (yearStr) {
      const date = new Date(`${yearStr}-01-01`);
      setSelectedDate(date);
      handleChange('releaseDate', formatDate(date));
    }

    // Clear search results after selection
    setSearchResults([]);
    setQuery('');
  };

  const handleChange = (field: keyof Movie, value: Movie[keyof Movie]) => {
    setMovie((prev) => ({ ...prev, [field]: value }) as Movie);
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    handleChange('releaseDate', formatDate(newDate));
  };

  const requiredFields: { key: keyof Movie; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'releaseDate', label: 'Release Date' },
  ];

  const validateForm = () => {
    for (const field of requiredFields) {
      const value = movie[field.key];
      const isEmpty = typeof value === 'string' ? !value.trim() : !value;
      if (isEmpty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validateForm()) return;

    const movieData = {
      ...movie,
      id: movieToEdit?.id || generateSlug(movie.title),
      releaseDate: formatDate(selectedDate),
    } as Movie;

    try {
      const result = movieToEdit
        ? await updateMovie(movieData)
        : await addMovie(movieData);
      if (result.success) {
        toast.success(
          movieToEdit
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

  const handleDelete = async () => {
    if (!movieToEdit) return;
    try {
      const result = await deleteMovie(movieToEdit.id);
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

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete this movie? This action cannot be
          undone.
        </p>
        <div className='flex justify-center mb-6'>
          <MovieCard movie={currentPreview} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handleDelete();
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
          <MovieCard movie={currentPreview} isPreview />
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e?.preventDefault();
                  performSearch(query);
                }
              }}
            />
            <Button variant='primary' onClick={() => performSearch(query)}>
              {searchLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchError && (
            <p className='text-xs text-destructive'>{searchError}</p>
          )}

          {searchResults.length > 0 && (
            <div className='grid grid-cols-1 gap-3'>
              {searchResults.map((r, i) => {
                const poster = getString(r['#IMG_POSTER'] ?? r['poster'] ?? '');
                const title = getString(r['#TITLE'] ?? r['title'] ?? '');
                const year = getString(r['#YEAR'] ?? r['year'] ?? '');
                const actors = getString(r['#ACTORS'] ?? '');

                return (
                  <Card key={i} onClick={() => handleSelectResult(r)}>
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={movie.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='Titanic'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='releaseDate' required>
              Release Date
            </FormLabel>
            <DateSelect
              value={selectedDate}
              onChange={handleDateChange}
              mode='month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='imdbId'>IMDB ID</FormLabel>
            <Input
              type='text'
              value={movie.imdbId || ''}
              onChange={(e) => handleChange('imdbId', e.target.value)}
              placeholder='e.g. tt0111161'
            />
          </div>
          <div>
            <FormLabel htmlFor='posterUrl'>Poster URL</FormLabel>
            <Input
              type='text'
              value={movie.posterUrl || ''}
              onChange={(e) => handleChange('posterUrl', e.target.value)}
              placeholder='https://example.com/poster.jpg'
            />
          </div>
          <div>
            <FormLabel htmlFor='imdbLink'>IMDB Link</FormLabel>
            <Input
              type='text'
              value={movie.imdbLink || ''}
              onChange={(e) => handleChange('imdbLink', e.target.value)}
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
                    onClick={() => handleChange('rating', i)}
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

      {movieToEdit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handleSubmit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default MovieForm;
