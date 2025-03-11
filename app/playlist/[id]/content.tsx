'use client';

import { Icon } from '@/components/UI';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SongCard from '@/components/Card/Song';
import Image from 'next/image';
import { Playlist } from '@/types/playlist';
import { getPlaylists } from '@/functions/playlists';

export default function PlaylistContent() {
  const params = useParams();
  const id = params.id as string;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const playlists = await getPlaylists();
        const foundPlaylist = playlists.find((p) => p.id === id);

        if (foundPlaylist) {
          setPlaylist(foundPlaylist);
        } else {
          setError('Playlist not found');
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className='flex justify-center py-10'>
        <div className='animate-pulse text-gray-500 dark:text-gray-400'>
          Loading playlist...
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className='mt-8 rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-gray-500 dark:text-gray-400'>
          {error || 'Playlist not found'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <Link
              href='/playlist'
              className='flex items-center text-sm lg:text-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4'
            >
              <span className='mr-2 h-6 w-6'>
                <Icon name='arrowLeft' />
              </span>
              Back to Playlists
            </Link>
          </div>
        </div>
      </div>

      <div className='mb-8 flex flex-col lg:flex-row gap-6 items-start'>
        <div className='relative h-48 w-48 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <Image
            src={playlist.imageUrl || '/placeholder.svg'}
            fill
            className='rounded-md object-cover'
            alt={`playlist-cover-${playlist.name}`}
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        <div>
          <h1 className='text-1 font-medium tracking-wide text-black dark:text-white mb-2'>
            {playlist.name}
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            {playlist.description}
          </p>
        </div>
      </div>

      <div className='mt-8 space-y-6'>
        {playlist.songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
