'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/UI';
import {
  getCurrentTrack,
  getRecentlyPlayed,
  getSpotifyAuthUrl,
} from '@/lib/spotify';
import { Hover } from '@/components/Visual';
import { getTimeAgo } from '@/utilities/timeAgo';
import LoadingSkeleton from './loading';
import { drawer } from '@/components/Drawer';
import SpotifyListeningHistory from '@/components/Drawer/ListeningHistory';
import Tooltip from '@/components/UI/Tooltip';

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyResponse {
  is_playing: boolean;
  item: SpotifyTrack;
}

interface RecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
}

const CurrentlyListening = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenListeningHistoryDrawer = () => {
    drawer.open(<SpotifyListeningHistory />);
  };

  const fetchTracks = async () => {
    try {
      setIsLoading(true);
      const currentResponse = await getCurrentTrack();

      if (!currentResponse) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      if (currentResponse.status === 200) {
        const data: SpotifyResponse = await currentResponse.json();
        setCurrentTrack(data.item);
        setIsPlaying(data.is_playing);
        setLastPlayedAt(null);
        setIsLoading(false);
        return;
      }

      const recentResponse = await getRecentlyPlayed();
      if (recentResponse?.ok) {
        const data: RecentlyPlayedResponse = await recentResponse.json();
        if (data.items.length > 0) {
          setCurrentTrack(data.items[0].track);
          setIsPlaying(false);
          const lastPlayedAt = new Date(data.items[0].played_at)
            .toLocaleDateString('en-GB')
            .split('T')[0];
          setLastPlayedAt(lastPlayedAt);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Spotify data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
    const interval = setInterval(fetchTracks, 30000);

    return () => clearInterval(interval);
  }, []);

  if (error) return null;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthorized) {
    return (
      <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
        <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
          <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
            <span className='h-4.5 w-4.5 lg:h-7 lg:w-7'>
              <Icon name='musicNotes' />
            </span>
            <span>Spotify Integration</span>
          </div>
        </div>

        <div className='p-4'>
          <button
            onClick={() => (window.location.href = getSpotifyAuthUrl())}
            className='w-full flex items-center justify-center gap-2 bg-[#1DB954] text-white py-2 px-4 rounded-md hover:bg-[#1ed760] transition-colors'
          >
            <Icon name='spotifyLogo' className='size-5' />
            <span>Connect with Spotify</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentTrack) return null;

  return (
    <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='flex w-full items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
        <div className='flex items-center gap-x-2 text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
          <Icon name='musicNotes' className='size-5' />
          <span className='h-5'>
            {isPlaying ? 'Currently Listening' : 'Last Played'}
          </span>
        </div>
        <div className='hidden md:flex md:items-center'>
          <Tooltip text='Listening History'>
            <div
              onClick={handleOpenListeningHistoryDrawer}
              className='cursor-pointer'
            >
              <Icon name='clockCounterClockwise' className='size-5' />
            </div>
          </Tooltip>
        </div>
        <div className='block md:hidden'>
          <div
            onClick={handleOpenListeningHistoryDrawer}
            className='cursor-pointer'
          >
            <Icon name='clockCounterClockwise' className='size-5' />
          </div>
        </div>
      </div>

      <Link
        href={currentTrack.external_urls.spotify}
        target='_blank'
        className='group relative flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
      >
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='relative h-16 w-16 flex-shrink-0'
        >
          <Image
            src={currentTrack.album.images[0]?.url || '/images/placeholder.png'}
            alt={currentTrack.album.name}
            width={200}
            height={200}
            className='rounded-md object-cover'
          />

          {isPlaying && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-md'>
              <div className='size-8 animate-pulse'>
                <Icon name='playCircle' className='text-white' />
              </div>
            </div>
          )}
        </Hover>

        <div className='flex-1 min-w-0 space-y-1'>
          <h3 className='font-medium text-md text-neutral-900 dark:text-white truncate'>
            {currentTrack.name}
          </h3>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
            {currentTrack.artists.map((artist) => artist.name).join(', ')}
          </p>
          <div className='flex items-center gap-x-2'>
            <span className='text-xs text-neutral-500 dark:text-neutral-400 truncate'>
              {currentTrack.album.name}
            </span>
            <span className='text-xs text-neutral-500 dark:text-neutral-40'>
              |
            </span>
            {isPlaying ? (
              <span className='flex items-center gap-x-1 text-xs text-green-500'>
                <span className='size-2 rounded-full bg-green-500 animate-pulse' />
                <span>Playing now</span>
              </span>
            ) : (
              lastPlayedAt && (
                <span className='text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0'>
                  Played {getTimeAgo(lastPlayedAt)}
                </span>
              )
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CurrentlyListening;
