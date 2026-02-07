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
import {
  Button,
  Icon,
  Separator,
  Skeleton,
  TimeAgo,
  Tooltip,
} from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { useAuth } from '@/contexts/auth-context';
import { useLoadingToggle } from '@/contexts/loading-context';
import { getSpotifyAuthUrl } from '@/lib/spotify-client';
import { SpotifyTrack } from '@/types/spotify';

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

interface SpotifyBannerProps {
  showMoreButton?: boolean;
}

const BannerHeader = ({
  isPlaying,
  isLoading = false,
  showMoreButton = true,
}: {
  isPlaying?: boolean;
  isLoading?: boolean;
  showMoreButton?: boolean;
}) => {
  const GoToMusicButton = (
    <Link href='/music' prefetch={true}>
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} className='rounded-sm' />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {isLoading ? (
          <>
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={140} height={24} />
          </>
        ) : (
          <>
            <Icon name='musicNotes' className='size-7 text-theme-green' />
            <span>{isPlaying ? 'Currently Listening' : 'Recently Played'}</span>
          </>
        )}
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
  isLoading,
  currentTrack,
  lastPlayedAt,
  showMoreButton = true,
}: {
  isPlaying?: boolean;
  isLoading?: boolean;
  currentTrack?: SpotifyTrack | null;
  lastPlayedAt?: string | null;
  showMoreButton?: boolean;
}) => {
  const content = (
    <div className='group relative flex items-center gap-x-4 p-4'>
      <div className='relative h-16 w-16 flex-shrink-0'>
        {isLoading ? (
          <Skeleton width='100%' height='100%' className='rounded-md' />
        ) : (
          <ImageWithFallback
            src={currentTrack?.album.images[0]?.url}
            alt={currentTrack?.album.name || ''}
            width={200}
            height={200}
            sizes='(max-width: 768px) 64px, 64px'
            className='object-cover'
            type='square'
          />
        )}
      </div>

      <div className='flex-col min-w-0 space-y-1 flex-1'>
        <h3 className='font-bold text-md text-theme-aqua truncate leading-6 h-6 flex items-center'>
          {isLoading ? (
            <Skeleton width={160} height={18} as='span' />
          ) : (
            currentTrack?.name
          )}
        </h3>
        <p className='text-sm text-theme-yellow font-medium truncate leading-5 h-5 flex items-center'>
          {isLoading ? (
            <Skeleton width={120} height={14} as='span' />
          ) : (
            currentTrack?.artists.map((artist) => artist.name).join(', ')
          )}
        </p>
        <div className='flex items-center gap-x-2 leading-4 h-4'>
          {isLoading ? (
            <>
              <Skeleton width={100} height={12} as='span' />
              <span className='text-xs text-muted-foreground dark:text-muted-foreground'>
                |
              </span>
              <Skeleton width={80} height={12} as='span' />
            </>
          ) : (
            <>
              <span className='text-xs text-theme-blue truncate min-w-0 flex-shrink'>
                {currentTrack?.album.name}
              </span>
              <span className='text-xs text-muted-foreground dark:text-muted-foreground flex-shrink-0'>
                |
              </span>
              {isPlaying ? (
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
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card isPreview className='h-full'>
      <BannerHeader
        isPlaying={isPlaying}
        isLoading={isLoading}
        showMoreButton={showMoreButton}
      />
      <Separator margin='0' />
      {!isLoading && currentTrack ? (
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
  const [isAuthorized, setIsAuthorized] = useState(apiCache.isAuthorized);
  const [dataLoading, setDataLoading] = useState(!apiCache.currentTrack);
  const { forceLoading, forceEmpty } = useLoadingToggle();
  const isLoading = dataLoading || forceLoading;

  const { isAdmin, loading: authLoading } = useAuth();
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
    apiCache.isAuthorized = isAuthorized;
  }, [currentTrack, isPlaying, lastPlayedAt, isAuthorized]);

  const fetchTracksRef = useRef<() => Promise<void>>(null);

  const fetchTracks = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      // Use internal API routes to handle token refresh server-side
      const currentResponse = await fetch('/api/spotify/current-track');

      if (currentResponse.status === 401 || currentResponse.status === 404) {
        // Token issues
        if (!apiCache.currentTrack) {
          setIsAuthorized(false);
        }
        setDataLoading(false);
        return;
      }

      // Only mark as authorized if we got a successful response
      if (currentResponse.ok) {
        setIsAuthorized(true);
      } else {
        // Mark as not authorized for any other error responses
        setIsAuthorized(false);
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
        const data = (await currentResponse.json()) as {
          isPlaying: boolean;
          item: SpotifyTrack | null;
        };

        if (data.isPlaying && !data.item) {
          // Ad playing - we'll try recently played instead
        } else if (data.item) {
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
            const recentlyPlayed = (await recentRes.json()) as {
              items: Array<{ track: SpotifyTrack; playedAt: string }>;
            };

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

  if (!mounted || isLoading || authLoading) {
    return (
      <SpotifyLayout
        isLoading={true}
        isPlaying={isPlaying}
        showMoreButton={showMoreButton}
      />
    );
  }
  if (!isAuthorized) {
    return (
      <Card isPreview>
        <div className='flex w-full items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
            <Icon name='musicNotes' className='size-7 text-theme-green' />
            <span>Spotify Integration</span>
          </div>
        </div>

        <Separator margin='0' />

        <div className='flex items-center justify-center min-h-[100px] p-4'>
          {isAdmin ? (
            <Button
              icon='spotifyLogo'
              className='bg-[#1DB954] text-theme-bg font-bold hover:bg-[#1ed760]'
              onClick={() => {
                const url = getSpotifyAuthUrl();
                window.location.href = url;
              }}
            >
              Connect with Spotify
            </Button>
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
    <SpotifyLayout
      isPlaying={isPlaying}
      isLoading={false}
      currentTrack={currentTrack}
      lastPlayedAt={lastPlayedAt}
      showMoreButton={showMoreButton}
    />
  );
};

export default SpotifyBanner;
