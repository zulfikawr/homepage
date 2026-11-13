'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';

import ImageWithFallback from '@/components/image-with-fallback';
import { Card } from '@/components/ui';
import { Button, Icon, Separator, TimeAgo, Tooltip } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useLoadingToggle } from '@/contexts/loading-context';
import { SpotifyTrack } from '@/types/spotify';

const FALLBACK_TRACK: SpotifyTrack = {
  id: 'fallback-demolition-lovers',
  name: 'Demolition Lovers',
  artists: [{ name: 'My Chemical Romance' }],
  album: {
    name: 'I Brought You My Bullets, You Brought Me Your Love',
    images: [
      {
        url: '/images/demolition-lovers.jpg',
      },
    ],
  },
  external_urls: {
    spotify:
      'https://open.spotify.com/search/My%20Chemical%20Romance%20Demolition%20Lovers',
  },
  duration_ms: 0,
};

const LOADING_TRACK: SpotifyTrack = {
  id: 'loading-track',
  name: 'Track Name',
  artists: [{ name: 'Artist Name' }],
  album: {
    name: 'Album Name',
    images: [{ url: '/images/placeholder-square.png' }],
  },
  external_urls: {
    spotify: '#',
  },
  duration_ms: 0,
};

const apiCache: {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  lastPlayedAt: string | null;
} = {
  currentTrack: null,
  isPlaying: false,
  lastPlayedAt: null,
};

interface SpotifyBannerProps {
  showMoreButton?: boolean;
}

const BannerHeader = ({
  isPlaying,
  isFallback = false,
  showMoreButton = true,
}: {
  isPlaying?: boolean;
  isFallback?: boolean;
  showMoreButton?: boolean;
}) => {
  const GoToMusicButton = (
    <Link aria-label='View music' href='/music' prefetch={false}>
      <Button
        aria-label='View music'
        className='h-7 !p-1 dark:bg-muted tracking-normal'
      >
        <Icon name='caretRight' className='size-5' />
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        <Icon name='musicNotes' className='size-7 text-theme-green' />
        <span>
          {isFallback
            ? 'On Repeat'
            : isPlaying
              ? 'Currently Listening'
              : 'Recently Played'}
        </span>
      </div>

      {showMoreButton && (
        <>
          <div className='hidden md:block'>
            <Tooltip text='Music Stats'>{GoToMusicButton}</Tooltip>
          </div>

          <div className='block md:hidden'>{GoToMusicButton}</div>
        </>
      )}
    </div>
  );
};

const SpotifyLayout = ({
  isPlaying,
  isFallback = false,
  isLoading,
  currentTrack,
  lastPlayedAt,
  showMoreButton = true,
}: {
  isPlaying?: boolean;
  isFallback?: boolean;
  isLoading?: boolean;
  currentTrack: SpotifyTrack;
  lastPlayedAt?: string | null;
  showMoreButton?: boolean;
}) => {
  const content = (
    <div className='group relative flex items-center gap-x-4 p-4'>
      <div className='relative h-16 w-16 flex-shrink-0'>
        <ImageWithFallback
          src={currentTrack.album.images[0]?.url}
          alt={currentTrack.album.name}
          width={200}
          height={200}
          sizes='(max-width: 768px) 64px, 64px'
          className='object-cover'
          type='square'
          priority
        />
      </div>

      <div className='flex-col min-w-0 space-y-1 flex-1'>
        <h2 className='font-bold text-md text-theme-aqua truncate leading-6 h-6 flex items-center'>
          <span className='truncate'>{currentTrack.name}</span>
        </h2>
        <p className='text-sm text-theme-yellow font-medium truncate leading-5 h-5 flex items-center'>
          <span className='truncate'>
            {currentTrack.artists.map((artist) => artist.name).join(', ')}
          </span>
        </p>
        <div className='flex items-center gap-x-2 leading-4 h-4'>
          <span className='text-xs text-theme-blue truncate min-w-0 flex-shrink'>
            {currentTrack.album.name}
          </span>
          <span className='text-xs text-muted-foreground dark:text-muted-foreground flex-shrink-0'>
            |
          </span>
          {isFallback ? (
            <span className='text-xs text-theme-green font-medium flex-shrink-0'>
              On repeat
            </span>
          ) : isPlaying ? (
            <span className='flex items-center gap-x-2 text-xs text-theme-green font-medium flex-shrink-0'>
              <span className='relative flex h-1.5 w-1.5'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-aqua opacity-75'></span>
                <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-theme-aqua'></span>
              </span>
              <span>Playing now</span>
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
    </div>
  );

  return (
    <Card isPreview className='h-full'>
      <Shimmer
        loading={!!isLoading}
        containerClassName='flex flex-1 flex-col [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&_.shimmer-measure-container]:flex-1 [&_.shimmer-measure-container]:flex [&_.shimmer-measure-container]:flex-col'
      >
        <BannerHeader
          isPlaying={isPlaying}
          isFallback={isFallback}
          showMoreButton={showMoreButton}
        />
        <Separator margin='0' />
        {!isLoading ? (
          <Link
            href={currentTrack.external_urls.spotify}
            target='_blank'
            className='flex-1 flex items-center hover:bg-muted/50 transition-colors'
          >
            {content}
          </Link>
        ) : (
          <div className='flex-1 flex items-center'>{content}</div>
        )}
      </Shimmer>
    </Card>
  );
};

const emptySubscribe = () => () => {};

const SpotifyBanner: React.FC<SpotifyBannerProps> = ({
  showMoreButton = true,
}) => {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(
    apiCache.currentTrack,
  );
  const [isPlaying, setIsPlaying] = useState(apiCache.isPlaying);
  const [error] = useState<string | null>(null);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(
    apiCache.lastPlayedAt,
  );
  const [dataLoading, setDataLoading] = useState(false);
  const { forceLoading, forceEmpty } = useLoadingToggle();
  const isLoading = dataLoading || forceLoading;

  const prevTrackId = useRef<string | null>(apiCache.currentTrack?.id || null);
  const retryDelay = useRef(1000);
  const isMounted = useRef(false);

  // Clear interval when unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sync state changes to cache
  useEffect(() => {
    apiCache.currentTrack = currentTrack;
    apiCache.isPlaying = isPlaying;
    apiCache.lastPlayedAt = lastPlayedAt;
  }, [currentTrack, isPlaying, lastPlayedAt]);

  const fetchTracksRef = useRef<() => Promise<void>>(null);

  const fetchTracks = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      // Use internal API routes to handle token refresh server-side
      const currentResponse = await fetch('/api/spotify/current-track');

      if (currentResponse.status === 401 || currentResponse.status === 404) {
        setDataLoading(false);
        return;
      }

      if (currentResponse.status === 429) {
        const retryAfter = currentResponse.headers.get('Retry-After') || '1';
        retryDelay.current = parseInt(retryAfter) * 1000;
        setTimeout(() => {
          fetchTracksRef.current?.();
        }, retryDelay.current);
        retryDelay.current = Math.min(retryDelay.current * 2, 60000);

        setDataLoading(false);
        return;
      }

      let foundCurrentTrack = false;

      if (currentResponse.status === 200) {
        const response = (await currentResponse.json()) as {
          success: boolean;
          data: {
            isPlaying: boolean;
            item: SpotifyTrack | null;
          } | null;
        };
        const data = response.data;

        if (data && data.isPlaying && !data.item) {
          // Ad playing - we'll try recently played instead
        } else if (data && data.item) {
          // We have a currently playing track
          foundCurrentTrack = true;

          if (data.item.id !== prevTrackId.current) {
            setCurrentTrack(data.item);
            prevTrackId.current = data.item.id || null;
          }

          setIsPlaying(data.isPlaying);
          setLastPlayedAt(null);
          setDataLoading(false);
          retryDelay.current = 1000;
        }
      }

      // If we don't have a current track playing, ALWAYS check recently played
      if (!foundCurrentTrack) {
        try {
          const recentRes = await fetch('/api/spotify/recently-played?limit=1');
          if (recentRes.ok) {
            const response = (await recentRes.json()) as {
              success: boolean;
              data: {
                items: Array<{ track: SpotifyTrack; playedAt: string }>;
              };
            };
            const recentlyPlayed = response.data;

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

              // Pass the raw ISO timestamp directly to TimeAgo
              setLastPlayedAt(recentlyPlayed.items[0].playedAt);
            }
          }
        } catch {
          // Ignored
        }

        setDataLoading(false);
      }
    } catch {
      // Set a retry with backoff
      setTimeout(() => {
        fetchTracksRef.current?.();
      }, retryDelay.current);
      retryDelay.current = Math.min(retryDelay.current * 2, 60000);

      setDataLoading(false);
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

  const isShimmering = !mounted || isLoading;
  const displayTrack = isShimmering
    ? LOADING_TRACK
    : currentTrack || FALLBACK_TRACK;
  const isFallback = !isShimmering && !currentTrack;

  return (
    <SpotifyLayout
      isPlaying={isPlaying}
      isFallback={isFallback}
      isLoading={isShimmering}
      currentTrack={displayTrack}
      lastPlayedAt={isFallback ? null : lastPlayedAt}
      showMoreButton={showMoreButton}
    />
  );
};

export default SpotifyBanner;
