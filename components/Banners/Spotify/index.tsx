'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Card } from '@/components/UI';
import {
  Button,
  Icon,
  Separator,
  Skeleton,
  TimeAgo,
  Tooltip,
} from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { useAuth } from '@/contexts/authContext';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { getSpotifyAuthUrl } from '@/lib/spotify-client';
import { SpotifyTrack } from '@/types/spotify';

const api_cache: {
  current_track: SpotifyTrack | null;
  is_playing: boolean;
  last_played_at: string | null;
  is_authorized: boolean;
} = {
  current_track: null,
  is_playing: false,
  last_played_at: null,
  is_authorized: true,
};

interface SpotifyBannerProps {
  showMoreButton?: boolean;
  className?: string;
}

const BannerHeader = ({
  is_playing,
  isLoading = false,
}: {
  is_playing?: boolean;
  isLoading?: boolean;
}) => {
  const GoToMusicButton = (
    <Link href='/music' prefetch={true}>
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} />
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
            <Skeleton width={160} height={20} />
          </>
        ) : (
          <>
            <Icon name='musicNotes' className='size-7 text-gruv-green' />
            <span>
              {is_playing ? 'Currently Listening' : 'Recently Played'}
            </span>
          </>
        )}
      </div>

      <div className='hidden md:block'>
        <Tooltip text='Music Stats'>{GoToMusicButton}</Tooltip>
      </div>

      <div className='block md:hidden'>{GoToMusicButton}</div>
    </div>
  );
};

const SpotifyLayout = ({
  className,
  is_playing,
  isLoading,
  current_track,
  last_played_at,
}: {
  className?: string;
  is_playing?: boolean;
  isLoading?: boolean;
  current_track?: SpotifyTrack | null;
  last_played_at?: string | null;
}) => {
  const content = (
    <div className='group relative flex items-center gap-x-4 p-4'>
      <div className='relative h-16 w-16 flex-shrink-0'>
        {isLoading ? (
          <Skeleton width='100%' height='100%' className='rounded-md' />
        ) : (
          <ImageWithFallback
            src={current_track?.album.images[0]?.url}
            alt={current_track?.album.name || ''}
            width={200}
            height={200}
            sizes='(max-width: 768px) 64px, 64px'
            className='object-cover'
            type='square'
          />
        )}
      </div>

      <div className='flex-col min-w-0 space-y-1 flex-1'>
        <h3 className='font-bold text-md text-gruv-aqua truncate leading-6 h-6 flex items-center'>
          {isLoading ? (
            <Skeleton width='60%' height={16} as='span' />
          ) : (
            current_track?.name
          )}
        </h3>
        <p className='text-sm text-gruv-yellow font-medium truncate leading-5 h-5 flex items-center'>
          {isLoading ? (
            <Skeleton width='40%' height={14} as='span' />
          ) : (
            current_track?.artists.map((artist) => artist.name).join(', ')
          )}
        </p>
        <div className='flex items-center gap-x-2 leading-4 h-4'>
          {isLoading ? (
            <>
              <Skeleton width='30%' height={12} as='span' />
              <span className='text-xs text-muted-foreground dark:text-muted-foreground'>
                |
              </span>
              <Skeleton width='25%' height={12} as='span' />
            </>
          ) : (
            <>
              <span className='text-xs text-gruv-blue truncate'>
                {current_track?.album.name}
              </span>
              <span className='text-xs text-muted-foreground dark:text-muted-foreground'>
                |
              </span>
              {is_playing ? (
                <span className='flex items-center gap-x-2 text-xs text-gruv-green font-medium'>
                  <span className='relative flex h-1.5 w-1.5'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-gruv-aqua opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-gruv-aqua'></span>
                  </span>
                  <span className='truncate'>Playing now</span>
                </span>
              ) : last_played_at ? (
                <TimeAgo
                  date={last_played_at}
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
    <Card isPreview className={className}>
      <BannerHeader is_playing={is_playing} isLoading={isLoading} />
      <Separator margin='0' />
      {!isLoading && current_track ? (
        <Link
          href={current_track.external_urls.spotify}
          target='_blank'
          className='block h-full hover:bg-muted/50 transition-colors'
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </Card>
  );
};

const SpotifyBanner: React.FC<SpotifyBannerProps> = ({ className }) => {
  const [current_track, set_current_track] = useState<SpotifyTrack | null>(
    api_cache.current_track,
  );
  const [is_playing, set_is_playing] = useState(api_cache.is_playing);
  const [error] = useState<string | null>(null);
  const [last_played_at, set_last_played_at] = useState<string | null>(
    api_cache.last_played_at,
  );
  const [is_authorized, set_is_authorized] = useState(api_cache.is_authorized);
  const [data_loading, set_data_loading] = useState(!api_cache.current_track);
  const { forceLoading, forceEmpty } = useLoadingToggle();
  const isLoading = data_loading || forceLoading;

  const { isAdmin, loading: authLoading } = useAuth();
  const prev_track_id = useRef<string | null>(
    api_cache.current_track?.id || null,
  );
  const retry_delay = useRef(1000);
  const is_mounted = useRef(false);

  // Clear interval when unmounting
  useEffect(() => {
    is_mounted.current = true;
    return () => {
      is_mounted.current = false;
    };
  }, []);

  // Sync state changes to cache
  useEffect(() => {
    api_cache.current_track = current_track;
    api_cache.is_playing = is_playing;
    api_cache.last_played_at = last_played_at;
    api_cache.is_authorized = is_authorized;
  }, [current_track, is_playing, last_played_at, is_authorized]);

  const fetch_tracks_ref = useRef<() => Promise<void>>(null);

  const fetch_tracks = useCallback(async () => {
    if (!is_mounted.current) return;

    try {
      // Use internal API routes to handle token refresh server-side
      const currentResponse = await fetch('/api/spotify/current-track');

      if (currentResponse.status === 401 || currentResponse.status === 404) {
        // Token issues
        if (!api_cache.current_track) {
          set_is_authorized(false);
        }
        set_data_loading(false);
        return;
      }

      // Only mark as authorized if we got a successful response
      if (currentResponse.ok) {
        set_is_authorized(true);
      } else {
        // Mark as not authorized for any other error responses
        set_is_authorized(false);
      }

      if (currentResponse.status === 429) {
        const retryAfter = currentResponse.headers.get('Retry-After') || '1';
        retry_delay.current = parseInt(retryAfter) * 1000;
        setTimeout(() => {
          fetch_tracks_ref.current?.();
        }, retry_delay.current);
        retry_delay.current = Math.min(retry_delay.current * 2, 60000);

        set_data_loading(false);
        return;
      }

      let found_current_track = false;

      if (currentResponse.status === 200) {
        const data = (await currentResponse.json()) as {
          is_playing: boolean;
          item: SpotifyTrack | null;
        };

        if (data.is_playing && !data.item) {
          // Ad playing - we'll try recently played instead
        } else if (data.item) {
          // We have a currently playing track
          found_current_track = true;

          if (data.item.id !== prev_track_id.current) {
            set_current_track(data.item);
            prev_track_id.current = data.item.id || null;
          }

          set_is_playing(data.is_playing);
          set_last_played_at(null);
          set_data_loading(false);
          retry_delay.current = 1000;
        }
      }

      // If we don't have a current track playing, ALWAYS check recently played
      if (!found_current_track) {
        try {
          const recentRes = await fetch('/api/spotify/recently-played?limit=1');
          if (recentRes.ok) {
            const recently_played = (await recentRes.json()) as {
              items: Array<{ track: SpotifyTrack; played_at: string }>;
            };

            // Check if we have recent tracks
            if (
              recently_played &&
              recently_played.items &&
              recently_played.items.length > 0
            ) {
              const new_track = recently_played.items[0].track;

              set_current_track(new_track);
              prev_track_id.current = new_track.id;
              set_is_playing(false);

              // Pass the raw ISO timestamp directly to TimeAgo
              set_last_played_at(recently_played.items[0].played_at);
            }
          }
        } catch {
          // Ignored
        }

        set_data_loading(false);
      }
    } catch {
      // Set a retry with backoff
      setTimeout(() => {
        fetch_tracks_ref.current?.();
      }, retry_delay.current);
      retry_delay.current = Math.min(retry_delay.current * 2, 60000);

      set_data_loading(false);
    }
  }, []);

  // Use an effect to assign the function to the ref
  useEffect(() => {
    (fetch_tracks_ref as React.RefObject<() => Promise<void>>).current =
      fetch_tracks;
  }, [fetch_tracks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch_tracks();
    }, 0);

    // Adjust polling interval based on state
    const interval = setInterval(
      () => {
        // Don't fetch if we're not mounted or if we're in a retry delay
        if (is_mounted.current && retry_delay.current <= 1000) {
          fetch_tracks();
        }
      },
      is_playing ? 10000 : 30000,
    ); // 10s when playing, 30s when not

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [is_playing, fetch_tracks]);

  if (error || forceEmpty)
    return <CardEmpty message='No data' className={className} />;

  if (isLoading || authLoading) {
    return (
      <SpotifyLayout
        className={className}
        isLoading={true}
        is_playing={is_playing}
      />
    );
  }

  if (!is_authorized) {
    return (
      <Card isPreview className={className}>
        <div className='flex w-full items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
            <Icon name='musicNotes' className='size-7 text-gruv-green' />
            <span>Spotify Integration</span>
          </div>
        </div>

        <Separator margin='0' />

        <div className='flex items-center justify-center min-h-[100px] p-4'>
          {isAdmin ? (
            <Button
              icon='spotifyLogo'
              className='bg-[#1DB954] text-gruv-bg font-bold hover:bg-[#1ed760]'
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

  if (!current_track)
    return <CardEmpty message='No data' className={className} />;

  return (
    <SpotifyLayout
      className={className}
      is_playing={is_playing}
      isLoading={false}
      current_track={current_track}
      last_played_at={last_played_at}
    />
  );
};

export default SpotifyBanner;
