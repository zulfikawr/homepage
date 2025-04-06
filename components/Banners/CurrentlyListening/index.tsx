'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
import { formatDate } from '@/utilities/formatDate';
import ImageWithFallback from '@/components/ImageWithFallback';
import { SpotifyTrack } from '@/types/spotify';

const apiCache = {
  currentTrack: null,
  recentlyPlayed: null,
  lastUpdated: 0,
};

const CurrentlyListening = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error] = useState<string | null>(null);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevTrackId = useRef<string | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const retryDelay = useRef(1000);
  const isMounted = useRef(false);

  // Clear interval when unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Handle progress updates
  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    lastUpdateTime.current = Date.now();
  };

  // Start or stop progress tracking based on playback state
  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        // Only increment if we haven't received a server update in the last 2 seconds
        if (Date.now() - lastUpdateTime.current > 2000) {
          setProgress((prev) => {
            const newProgress = prev + 1000;
            return newProgress >= currentTrack.duration_ms ? 0 : newProgress;
          });
        }
      }, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack]);

  const fetchTracks = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      // First try to get current track
      const currentResponse = await getCurrentTrack();

      if (!currentResponse) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Handle rate limiting - if we get 429, exponentially back off
      if (currentResponse.status === 429) {
        const retryAfter = currentResponse.headers.get('Retry-After') || '1';
        retryDelay.current = parseInt(retryAfter) * 1000;
        setTimeout(fetchTracks, retryDelay.current);
        retryDelay.current = Math.min(retryDelay.current * 2, 60000); // Max 1 minute
        return;
      }

      if (currentResponse.status === 200) {
        const data = await currentResponse.json();
        apiCache.currentTrack = data;
        apiCache.lastUpdated = Date.now();

        // Handle ads
        if (data.is_playing && !data.item) {
          setShowSkeleton(true);
          return;
        }

        // Check if track changed
        if (data.item?.id !== prevTrackId.current) {
          setCurrentTrack(data.item);
          prevTrackId.current = data.item?.id || null;
          updateProgress(data.progress_ms);
          setShowSkeleton(false);
        } else {
          // Only update progress if track is the same
          updateProgress(data.progress_ms);
        }

        setIsPlaying(data.is_playing);
        setLastPlayedAt(null);
        setIsLoading(false);
        retryDelay.current = 1000; // Reset delay on success
        return;
      }

      // Only fetch recently played if we don't have current track data
      // AND if cache is stale (older than 30 seconds)
      if (
        (!currentTrack || !isPlaying) &&
        Date.now() - apiCache.lastUpdated > 30000
      ) {
        const recentResponse = await getRecentlyPlayed();
        if (!recentResponse) return;

        // Handle rate limiting
        if (recentResponse.status === 429) {
          const retryAfter = recentResponse.headers.get('Retry-After') || '1';
          retryDelay.current = parseInt(retryAfter) * 1000;
          setTimeout(fetchTracks, retryDelay.current);
          retryDelay.current = Math.min(retryDelay.current * 2, 60000); // Max 1 minute
          return;
        }

        if (recentResponse.ok) {
          const data = await recentResponse.json();
          apiCache.recentlyPlayed = data;
          apiCache.lastUpdated = Date.now();

          if (data.items.length > 0) {
            const newTrack = data.items[0].track;
            setCurrentTrack(newTrack);
            prevTrackId.current = newTrack.id;
            setIsPlaying(false);
            updateProgress(0);
            const lastPlayedAt = formatDate(data.items[0].played_at, {
              includeDay: true,
            });
            setLastPlayedAt(lastPlayedAt);
            setIsLoading(false);
            retryDelay.current = 1000; // Reset delay on success
          }
        }
      } else if (apiCache.recentlyPlayed) {
        // Use cached data if available
        const data = apiCache.recentlyPlayed;
        if (data.items.length > 0) {
          const newTrack = data.items[0].track;
          setCurrentTrack(newTrack);
          prevTrackId.current = newTrack.id;
          setIsPlaying(false);
          updateProgress(0);
          const lastPlayedAt = formatDate(data.items[0].played_at, {
            includeDay: true,
          });
          setLastPlayedAt(lastPlayedAt);
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setTimeout(fetchTracks, retryDelay.current);
      retryDelay.current = Math.min(retryDelay.current * 2, 60000); // Max 1 minute
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    fetchTracks();

    // Adjust polling interval based on state
    const interval = setInterval(
      () => {
        // Don't fetch if we're not mounted or if we're in a retry delay
        if (isMounted.current && retryDelay.current <= 1000) {
          fetchTracks();
        }
      },
      isPlaying ? 10000 : 30000,
    ); // 10s when playing, 30s when not

    return () => clearInterval(interval);
  }, [isPlaying, fetchTracks]);

  if (error) return null;

  if (isLoading || showSkeleton || (isPlaying && !currentTrack)) {
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
    <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 relative overflow-hidden'>
      <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
        <div className='flex items-center gap-x-2 text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
          <Icon name='musicNotes' className='size-5' />
          <span className='h-5'>
            {isPlaying ? 'Currently Listening' : 'Last Played'}
          </span>
        </div>
      </div>

      <Link
        href={currentTrack.external_urls.spotify}
        target='_blank'
        className='group relative flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
      >
        {isPlaying && (
          <div className='absolute inset-0 overflow-hidden rounded-b-md'>
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-neutral-200/50 dark:bg-neutral-700/50'>
              <div
                className='h-full bg-green-500'
                style={{
                  width: `${Math.min(100, (progress / currentTrack.duration_ms) * 100)}%`,
                  background: 'linear-gradient(90deg, #1DB954, #1ED760)',
                  boxShadow: '0 0 8px rgba(29, 185, 84, 0.6)',
                  transition: 'width 0.5s linear',
                }}
              />
            </div>
          </div>
        )}

        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='relative h-16 w-16 flex-shrink-0'
        >
          <ImageWithFallback
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.album.name}
            width={200}
            height={200}
            className='rounded-md object-cover'
            type='square'
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
                <span className='truncate'>Playing now</span>
              </span>
            ) : lastPlayedAt ? (
              <span className='text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0'>
                Played {getTimeAgo(lastPlayedAt)}
              </span>
            ) : (
              <span className='text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0'>
                Played just now
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CurrentlyListening;
