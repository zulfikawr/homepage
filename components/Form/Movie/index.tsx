'use client';

import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { Movie } from '@/types/movie';
import { Button, FormLabel, Input } from '@/components/UI';
import MovieCard from '@/components/Card/Movie';
import ImageWithFallback from '@/components/ImageWithFallback';
import { toast } from '@/components/Toast';
import { addMovie, updateMovie, deleteMovie } from '@/functions/movies';
import { modal } from '@/components/Modal';
import Separator from '@/components/UI/Separator';
import DateSelect from '@/components/DateSelect';
import { formatDate } from '@/utilities/formatDate';
import { generateId } from '@/utilities/generateId';
import { Icon } from '@/components/UI/Icon';
import { useRouter } from 'next/navigation';

interface MovieFormProps {
  movieToEdit?: Movie;
}

const initialMovieState: Movie = {
  id: '',
  title: '',
  releaseDate: '',
  imdbId: undefined,
  posterUrl: undefined,
  imdbLink: undefined,
  rating: undefined,
};

const MovieForm: React.FC<MovieFormProps> = ({ movieToEdit }) => {
  const [movie, setMovie] = useState<Movie>(movieToEdit || initialMovieState);

  const initialDate = useMemo(() => {
    const date = movieToEdit?.releaseDate
      ? new Date(movieToEdit.releaseDate)
      : new Date();
    return date;
  }, [movieToEdit]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const currentPreview: Movie = {
    id: movie.id || 'preview',
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
      const data = await res.json();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const movieData = {
      ...movie,
      id: movieToEdit?.id || generateId(movie.title),
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
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete this movie? This action cannot be
          undone.
        </p>
        <div className='flex justify-center mb-6'>
          <MovieCard movie={currentPreview} isInForm />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
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
          <MovieCard movie={currentPreview} isInForm />
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
                  e.preventDefault();
                  performSearch(query);
                }
              }}
            />
            <Button type='primary' onClick={() => performSearch(query)}>
              {searchLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchError && <p className='text-xs text-red-500'>{searchError}</p>}

          {searchResults.length > 0 && (
            <div className='grid grid-cols-1 gap-3'>
              {searchResults.map((r, i) => {
                const poster = getString(r['#IMG_POSTER'] ?? r['poster'] ?? '');
                const title = getString(r['#TITLE'] ?? r['title'] ?? '');
                const year = getString(r['#YEAR'] ?? r['year'] ?? '');
                const actors = getString(r['#ACTORS'] ?? '');

                return (
                  <button
                    type='button'
                    key={i}
                    className='flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
                    onClick={() => handleSelectResult(r)}
                  >
                    {poster ? (
                      <div className='h-16 w-11 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'>
                        <ImageWithFallback
                          width={44}
                          height={64}
                          src={poster}
                          alt={title}
                          className='h-full w-full object-cover'
                          loading='lazy'
                          type='portrait'
                        />
                      </div>
                    ) : (
                      <div className='h-16 w-11 flex-shrink-0 rounded-md bg-neutral-200 dark:bg-neutral-700' />
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='font-semibold text-sm line-clamp-2 text-neutral-900 dark:text-white'>
                        {title}
                      </div>
                      <div className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                        {year}
                      </div>
                      {actors && (
                        <div className='text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-1'>
                          {actors}
                        </div>
                      )}
                    </div>
                  </button>
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
            />
          </div>
          <div>
            <FormLabel htmlFor='posterUrl'>Poster URL</FormLabel>
            <Input
              type='text'
              value={movie.posterUrl || ''}
              onChange={(e) => handleChange('posterUrl', e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor='imdbLink'>IMDB Link</FormLabel>
            <Input
              type='text'
              value={movie.imdbLink || ''}
              onChange={(e) => handleChange('imdbLink', e.target.value)}
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
                    onMouseDown={(e) => e.preventDefault()}
                    className={`p-0.5 focus:outline-none ${filled ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}
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
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            type='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type='primary'
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
