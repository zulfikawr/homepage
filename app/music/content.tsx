'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import SpotifyBanner from '@/components/banners/spotify';
import ImageWithFallback from '@/components/image-with-fallback';
import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Icon, Tooltip } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import PlaylistCard from '@/components/ui/card/variants/playlist/spotify';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { useLoadingToggle } from '@/contexts/loading-context';
import { useRadius } from '@/contexts/radius-context';
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';
import { getTimeAgo } from '@/utilities/time-ago';

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  playedAt: string;
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

const timeRangeOptions = [
  { value: 'short_term', label: 'Last 4 weeks' },
  { value: 'medium_term', label: 'Last 6 months' },
  { value: 'long_term', label: 'All time' },
];

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

interface SpotifyMusicContentProps {
  initialRecent?: RecentlyPlayedItem[];
  initialTopTracks?: SpotifyTrack[];
  initialTopArtists?: SpotifyArtist[];
  initialPlaylists?: SpotifyPlaylist[];
}

interface SpotifyDataResponse<T> {
  items: T[];
}

export default function SpotifyMusicContent({
  initialRecent,
  initialTopTracks,
  initialTopArtists,
  initialPlaylists,
}: SpotifyMusicContentProps) {
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedItem[]>(
    initialRecent || [],
  );
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>(
    initialTopTracks || [],
  );
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>(
    initialPlaylists || [],
  );
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>(
    initialTopArtists || [],
  );
  const [dataLoading, setDataLoading] = useState({
    recentTracks: !initialRecent,
    topTracks: !initialTopTracks,
    topArtists: !initialTopArtists,
    playlists: !initialPlaylists,
  });

  const { forceLoading, forceEmpty } = useLoadingToggle();
  const loading = {
    recentTracks: dataLoading.recentTracks || forceLoading,
    topTracks: dataLoading.topTracks || forceLoading,
    topArtists: dataLoading.topArtists || forceLoading,
    playlists: dataLoading.playlists || forceLoading,
  };

  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'recent' | 'top' | 'artists' | 'playlists'
  >('recent');
  const [tracksTimeRange, setTracksTimeRange] =
    useState<TimeRange>('short_term');
  const [artistsTimeRange, setArtistsTimeRange] =
    useState<TimeRange>('short_term');

  const { radius } = useRadius();

  const displayData = {
    recentTracks: forceEmpty ? [] : recentTracks,
    topTracks: forceEmpty ? [] : topTracks,
    topArtists: forceEmpty ? [] : topArtists,
    playlists: forceEmpty ? [] : playlists,
  };

  const loadData = useCallback(async () => {
    try {
      setError(null);

      const [recentRes, topRes, artistsRes, playlistsRes] = await Promise.all([
        fetch('/api/spotify/recently-played?limit=10'),
        fetch(`/api/spotify/top-tracks?limit=10&timeRange=${tracksTimeRange}`),
        fetch(
          `/api/spotify/top-artists?limit=10&timeRange=${artistsTimeRange}`,
        ),
        fetch('/api/spotify/playlists?limit=10'),
      ]);

      if (!recentRes.ok || !topRes.ok || !artistsRes.ok || !playlistsRes.ok) {
        throw new Error('Failed to fetch some Spotify data');
      }

      const [recentData, topData, artistsData, playlistsData] =
        await Promise.all([
          recentRes.json() as Promise<SpotifyDataResponse<RecentlyPlayedItem>>,
          topRes.json() as Promise<SpotifyDataResponse<SpotifyTrack>>,
          artistsRes.json() as Promise<SpotifyDataResponse<SpotifyArtist>>,
          playlistsRes.json() as Promise<SpotifyDataResponse<SpotifyPlaylist>>,
        ]);

      setRecentTracks(recentData?.items || []);
      setTopTracks(topData?.items || []);
      setTopArtists(artistsData?.items || []);
      setPlaylists(playlistsData?.items || []);

      setDataLoading({
        recentTracks: false,
        topTracks: false,
        topArtists: false,
        playlists: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDataLoading({
        recentTracks: false,
        topTracks: false,
        playlists: false,
        topArtists: false,
      });
    }
  }, [tracksTimeRange, artistsTimeRange]);

  // ... loadTopTracks and loadTopArtists ...

  const loadTopTracks = useCallback(async () => {
    try {
      setError(null);
      setDataLoading((prev) => ({ ...prev, topTracks: true }));

      const res = await fetch(
        `/api/spotify/top-tracks?limit=10&timeRange=${tracksTimeRange}`,
      );

      if (!res.ok) {
        throw new Error('Failed to fetch top tracks');
      }

      const data = (await res.json()) as SpotifyDataResponse<SpotifyTrack>;
      setTopTracks(data?.items || []);
      setDataLoading((prev) => ({ ...prev, topTracks: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDataLoading((prev) => ({ ...prev, topTracks: false }));
    }
  }, [tracksTimeRange]);

  const loadTopArtists = useCallback(async () => {
    try {
      setError(null);
      setDataLoading((prev) => ({ ...prev, topArtists: true }));

      const res = await fetch(
        `/api/spotify/top-artists?limit=10&timeRange=${artistsTimeRange}`,
      );

      if (!res.ok) {
        throw new Error('Failed to fetch top artists');
      }

      const data = (await res.json()) as SpotifyDataResponse<SpotifyArtist>;
      setTopArtists(data?.items || []);
      setDataLoading((prev) => ({ ...prev, topArtists: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDataLoading((prev) => ({ ...prev, topArtists: false }));
    }
  }, [artistsTimeRange]);

  useEffect(() => {
    if (
      !initialRecent &&
      !initialTopTracks &&
      !initialTopArtists &&
      !initialPlaylists
    ) {
      loadData();
    } else {
      // Data already provided by server
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className='p-4 text-destructive'>
        {error}
        <Button onClick={loadData} className='ml-4'>
          Retry
        </Button>
      </div>
    );
  }

  const TimeRangeDropdown = ({
    value,
    onChange,
  }: {
    value: TimeRange;
    onChange: (value: TimeRange) => void;
  }) => {
    return (
      <Dropdown
        trigger={
          <Button
            variant='ghost'
            className='w-fit flex items-center gap-2 text-sm px-0 hover:bg-transparent group/time'
          >
            <span className='group-hover/time:text-primary transition-colors'>
              {timeRangeOptions.find((opt) => opt.value === value)?.label}
            </span>
            <Icon
              name='caretDown'
              className='size-4 group-hover/time:text-primary transition-colors'
            />
          </Button>
        }
      >
        <div className='flex flex-col space-y-1 whitespace-nowrap min-w-max'>
          {timeRangeOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => onChange(option.value as TimeRange)}
              isActive={value === option.value}
            >
              {option.label}
            </DropdownItem>
          ))}
        </div>
      </Dropdown>
    );
  };

  return (
    <div className='px-4 sm:px-6'>
      <PageTitle
        emoji='🎧'
        title='Music Stats'
        subtitle='My Spotify listening statistics'
      />

      {/* Currently Playing Section */}
      <div className='mt-8'>
        <SpotifyBanner showMoreButton={false} />
      </div>

      {/* Tabs Navigation */}
      <div className='mt-8 border-b border-border overflow-x-auto scrollbar-hide'>
        <nav className='flex space-x-8 min-w-max'>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'recent'
                ? 'border-gruv-green text-gruv-green dark:text-gruv-green'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-muted dark:hover:border-muted-foreground'
            }`}
          >
            <Icon name='playCircle' className='size-5' />
            Recently Played
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'top'
                ? 'border-gruv-green text-gruv-green dark:text-gruv-green'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-muted dark:hover:border-muted-foreground'
            }`}
          >
            <Icon name='musicNotes' className='size-5' />
            Top Tracks
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'artists'
                ? 'border-gruv-green text-gruv-green dark:text-gruv-green'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-muted dark:hover:border-muted-foreground'
            }`}
          >
            <Icon name='userCircle' className='size-5' />
            Top Artists
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'playlists'
                ? 'border-gruv-green text-gruv-green dark:text-gruv-green'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-muted dark:hover:border-muted-foreground'
            }`}
          >
            <Icon name='playlist' className='size-5' />
            Playlists
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className='mt-6'>
        {activeTab === 'recent' && (
          <div className='space-y-4'>
            {loading.recentTracks ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} variant='track' />)
            ) : displayData.recentTracks.length > 0 ? (
              <StaggerContainer>
                {displayData.recentTracks.map((item, index) => (
                  <ViewTransition key={index}>
                    <div
                      className='flex items-center gap-4 py-4 px-2 md:px-6 hover:bg-muted/50 hover:bg-muted transition-colors'
                      style={{ borderRadius: `${radius}px` }}
                    >
                      <span className='hidden md:flex text-muted-foreground dark:text-muted-foreground w-5 text-sm'>
                        {index + 1}
                      </span>
                      <div className='flex-shrink-0'>
                        <Tooltip text={item.track.album.name}>
                          <ImageWithFallback
                            src={item.track.album.images[0]?.url}
                            alt={item.track.album.name}
                            width={48}
                            height={48}
                            type='square'
                            sizes='48px'
                          />
                        </Tooltip>
                      </div>
                      <div className='min-w-0 flex-1 overflow-hidden'>
                        <Link
                          href={item.track.external_urls.spotify}
                          target='_blank'
                          className='font-medium hover:underline block truncate'
                          title={item.track.name}
                        >
                          {item.track.name}
                        </Link>
                        <p className='text-sm text-muted-foreground truncate'>
                          {item.track.artists
                            .map((artist) => artist.name)
                            .join(', ')}
                        </p>
                      </div>
                      <div className='text-xs text-muted-foreground whitespace-nowrap flex-shrink-0'>
                        {getTimeAgo(item.playedAt)}
                      </div>
                    </div>
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No recent tracks found' />
            )}
          </div>
        )}

        {activeTab === 'top' && (
          <div className='space-y-4'>
            <div className='flex justify-end'>
              <TimeRangeDropdown
                value={tracksTimeRange}
                onChange={(range) => {
                  setTracksTimeRange(range);
                  loadTopTracks();
                }}
              />
            </div>
            {loading.topTracks ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} variant='track' />)
            ) : displayData.topTracks.length > 0 ? (
              <StaggerContainer>
                {displayData.topTracks.map((track, index) => (
                  <ViewTransition key={track.id}>
                    <div
                      className='flex items-center gap-4 py-4 px-2 md:px-6 hover:bg-muted/50 hover:bg-muted transition-colors'
                      style={{ borderRadius: `${radius}px` }}
                    >
                      <span className='hidden md:flex text-muted-foreground dark:text-muted-foreground w-5 text-sm'>
                        {index + 1}
                      </span>
                      <div className='flex-shrink-0'>
                        <Tooltip text={track.album.name}>
                          <ImageWithFallback
                            src={track.album.images[0]?.url}
                            alt={track.album.name}
                            width={48}
                            height={48}
                            type='square'
                            sizes='48px'
                          />
                        </Tooltip>
                      </div>
                      <div className='min-w-0 flex-1 overflow-hidden'>
                        <Link
                          href={track.external_urls.spotify}
                          target='_blank'
                          className='font-medium hover:underline block truncate'
                          title={track.name}
                        >
                          {track.name}
                        </Link>
                        <p className='text-sm text-muted-foreground truncate'>
                          {track.artists
                            .map((artist) => artist.name)
                            .join(', ')}
                        </p>
                      </div>
                      <div className='text-xs text-muted-foreground whitespace-nowrap flex-shrink-0'>
                        {formatDuration(track.duration_ms)}
                      </div>
                    </div>
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No top tracks found' />
            )}
          </div>
        )}

        {activeTab === 'artists' && (
          <div className='space-y-4'>
            <div className='flex justify-end'>
              <TimeRangeDropdown
                value={artistsTimeRange}
                onChange={(range) => {
                  setArtistsTimeRange(range);
                  loadTopArtists();
                }}
              />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {loading.topArtists ? (
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center space-y-2 p-3'
                    >
                      <Skeleton width={96} height={96} variant='circle' />
                      <Skeleton width='75%' height={16} as='span' />
                    </div>
                  ))
              ) : displayData.topArtists.length > 0 ? (
                <StaggerContainer>
                  {displayData.topArtists.map((artist) => (
                    <ViewTransition key={artist.id}>
                      <Link
                        href={artist.external_urls.spotify}
                        target='_blank'
                        className='flex flex-col items-center space-y-2 p-3 hover:bg-muted/50 hover:bg-muted transition-colors'
                        style={{ borderRadius: `${radius}px` }}
                      >
                        <ImageWithFallback
                          src={artist.images[0]?.url}
                          alt={artist.name}
                          width={96}
                          height={96}
                          className='object-cover aspect-square'
                          type='square'
                          sizes='96px'
                        />
                        <h3 className='font-medium text-center'>
                          {artist.name}
                        </h3>
                      </Link>
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              ) : (
                <div className='col-span-full'>
                  <CardEmpty message='No top artists found' />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {loading.playlists ? (
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <CardLoading key={index} variant='playlist' />
                ))
            ) : displayData.playlists.length > 0 ? (
              <StaggerContainer>
                {displayData.playlists.map((playlist) => (
                  <ViewTransition key={playlist.id}>
                    <PlaylistCard playlist={playlist} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <div className='col-span-full'>
                <CardEmpty message='No playlists found' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
