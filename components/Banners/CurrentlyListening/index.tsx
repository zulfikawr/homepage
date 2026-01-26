import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Card } from '@/components/Card';
import CardEmpty from '@/components/Card/Empty';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Icon, Tooltip } from '@/components/UI';
import { TimeAgo } from '@/components/UI';
import { Hover } from '@/components/Visual';
import { useAuth } from '@/contexts/authContext';
import { useLoadingToggle } from '@/contexts/loadingContext';
import {
  getCurrentTrack,
  getRecentlyPlayed,
  getSpotifyAuthUrl,
} from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';

import LoadingSkeleton from './loading';

const apiCache: {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  lastPlayedAt: string | null;
  isAuthorized: boolean;
} = {
  currentTrack: null,
  isPlaying: false,
  lastPlayedAt: null,
  isAuthorized: true,
};

interface CurrentlyListeningProps {
  showMoreButton?: boolean;
}

const CurrentlyListening: React.FC<CurrentlyListeningProps> = ({
  showMoreButton = true,
}) => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(
    apiCache.currentTrack,
  );
  const [isPlaying, setIsPlaying] = useState(apiCache.isPlaying);
  const [error] = useState<string | null>(null);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(
    apiCache.lastPlayedAt,
  );
  const [isAuthorized, setIsAuthorized] = useState(apiCache.isAuthorized);
  const [dataLoading, setDataLoading] = useState(!apiCache.currentTrack);
  const { forceLoading, forceEmpty } = useLoadingToggle();
  const isLoading = dataLoading || forceLoading;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isAdmin, loading: authLoading } = useAuth();
  const prevTrackId = useRef<string | null>(apiCache.currentTrack?.id || null);
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

  // Sync state changes to cache
  useEffect(() => {
    apiCache.currentTrack = currentTrack;
    apiCache.isPlaying = isPlaying;
    apiCache.lastPlayedAt = lastPlayedAt;
    apiCache.isAuthorized = isAuthorized;
  }, [currentTrack, isPlaying, lastPlayedAt, isAuthorized]);

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
            return newProgress >= (currentTrack?.duration_ms || 0)
              ? 0
              : newProgress;
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

  const fetchTracksRef = useRef<() => Promise<void>>(null);

  const fetchTracks = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      // First attempt to get the currently playing track
      const currentResponse = await getCurrentTrack();

      if (!currentResponse) {
        // Only set unauthorized if we are explicitly not authorized (status 401)
        // or if we have no tokens at all. For transient errors, we keep current state.
        setDataLoading(false);
        setShowSkeleton(false);
        return;
      }

      if (currentResponse.status === 401) {
        // Explicitly unauthorized (token expired or invalid and refresh failed)
        if (!apiCache.currentTrack) {
          setIsAuthorized(false);
        }
        setDataLoading(false);
        setShowSkeleton(false);
        return;
      }

      // If we got any response (200, 204, etc), we are authorized
      setIsAuthorized(true);

      if (currentResponse.status === 429) {
        const retryAfter = currentResponse.headers.get('Retry-After') || '1';
        retryDelay.current = parseInt(retryAfter) * 1000;
        setTimeout(() => {
          fetchTracksRef.current?.();
        }, retryDelay.current);
        retryDelay.current = Math.min(retryDelay.current * 2, 60000);

        setDataLoading(false);
        setShowSkeleton(false);
        return;
      }

      let foundCurrentTrack = false;

      if (currentResponse.status === 200) {
        const data = await currentResponse.json();

        if (data.is_playing && !data.item) {
          // Ad playing - we'll try recently played instead
        } else if (data.item) {
          // We have a currently playing track
          foundCurrentTrack = true;

          if (data.item.id !== prevTrackId.current) {
            setCurrentTrack(data.item);
            prevTrackId.current = data.item.id || null;
            updateProgress(data.progress_ms);
          } else {
            updateProgress(data.progress_ms);
          }

          setIsPlaying(data.is_playing);
          setLastPlayedAt(null);
          setDataLoading(false);
          setShowSkeleton(false);
          retryDelay.current = 1000;
        }
      }

      // If we don't have a current track playing, ALWAYS check recently played
      if (!foundCurrentTrack) {
        try {
          const recentlyPlayed = await getRecentlyPlayed();

          // Check if we have recent tracks
          if (
            recentlyPlayed &&
            recentlyPlayed.items &&
            recentlyPlayed.items.length > 0
          ) {
            const newTrack = recentlyPlayed.items[0].track;

            setCurrentTrack(newTrack);
            prevTrackId.current = newTrack.id;
            setIsPlaying(false);
            updateProgress(0);

            // Pass the raw ISO timestamp directly to TimeAgo
            // Don't format it first, as TimeAgo can parse ISO timestamps correctly
            setLastPlayedAt(recentlyPlayed.items[0].played_at);
          }
        } catch {
          // Ignored
        }

        setDataLoading(false);
        setShowSkeleton(false);
      }
    } catch {
      // Set a retry with backoff
      setTimeout(() => {
        fetchTracksRef.current?.();
      }, retryDelay.current);
      retryDelay.current = Math.min(retryDelay.current * 2, 60000);

      setDataLoading(false);
      setShowSkeleton(false);
    }
  }, []);

  // Use an effect to assign the function to the ref
  useEffect(() => {
    (fetchTracksRef as React.RefObject<() => Promise<void>>).current =
      fetchTracks;
  }, [fetchTracks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTracks();
    }, 0);

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

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isPlaying, fetchTracks]);

  if (error || forceEmpty) return <CardEmpty message='No data' />;

  if (isLoading || showSkeleton || (isPlaying && !currentTrack)) {
    return <LoadingSkeleton />;
  }

  if (!isAuthorized) {
    if (authLoading) return <LoadingSkeleton />;

    return (
      <Card isPreview>
        <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 dark:border-border'>
          <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-foreground'>
            <span className='size-5'>
              <Icon name='musicNotes' />
            </span>
            <span>Spotify Integration</span>
          </div>
        </div>

        <div className='p-4'>
          {isAdmin ? (
            <div className='flex gap-2'>
              <button
                onClick={() => (window.location.href = getSpotifyAuthUrl())}
                className='flex-1 flex items-center justify-center gap-2 bg-[#1DB954] text-gruv-bg font-bold py-2 px-4 rounded-md hover:bg-[#1ed760] transition-colors'
              >
                <Icon name='spotifyLogo' className='size-5' />
                <span>Connect with Spotify</span>
              </button>
            </div>
          ) : (
            <div className='text-sm text-muted-foreground text-center'>
              Spotify integration is private.
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (!currentTrack) return <CardEmpty message='No data' />;

  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between border-b border-border px-4.5 py-2.5 dark:border-border'>
        <div className='flex items-center gap-x-2 text-[15px] font-medium tracking-wide text-foreground'>
          <Icon name='musicNotes' className='size-5 text-gruv-green' />
          <span>{isPlaying ? 'Currently Listening' : 'Last Played'}</span>
        </div>
        {showMoreButton && (
          <>
            <div className='hidden md:block'>
              <Tooltip text='Music Stats'>
                <Link href='/music'>
                  <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
                    <span className='size-5'>
                      <Icon name='caretRight' />
                    </span>
                  </Button>
                </Link>
              </Tooltip>
            </div>
            <div className='block md:hidden'>
              <Link href='/music'>
                <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
                  <span className='size-5'>
                    <Icon name='caretRight' />
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <Link
        href={currentTrack.external_urls.spotify}
        target='_blank'
        className='group relative flex items-center gap-4 p-4 hover:bg-muted/50 hover:bg-muted'
      >
        {isPlaying && (
          <div className='absolute inset-0 overflow-hidden rounded-b-md'>
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-muted/50 dark:bg-muted/50'>
              <div
                className='h-full bg-gruv-green'
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
            className='object-cover'
            type='square'
          />
        </Hover>

        <div className='flex-1 min-w-0 space-y-1'>
          <h3 className='font-bold text-md text-gruv-aqua truncate'>
            {currentTrack.name}
          </h3>
          <p className='text-sm text-gruv-yellow font-medium truncate'>
            {currentTrack.artists.map((artist) => artist.name).join(', ')}
          </p>
          <div className='flex items-center gap-x-2'>
            <span className='text-xs text-gruv-blue truncate'>
              {currentTrack.album.name}
            </span>
            <span className='text-xs text-muted-foreground dark:text-muted-foreground'>
              |
            </span>
            {isPlaying ? (
              <span className='flex items-center gap-x-1 text-xs text-gruv-green font-medium'>
                <span className='size-2 rounded-full bg-gruv-green animate-pulse' />
                <span className='truncate'>Playing now</span>
              </span>
            ) : lastPlayedAt ? (
              <TimeAgo
                date={lastPlayedAt}
                prefix='Played'
                className='text-xs text-muted-foreground flex-shrink-0'
              />
            ) : (
              <span className='text-xs text-muted-foreground flex-shrink-0'>
                Played just now
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CurrentlyListening;
