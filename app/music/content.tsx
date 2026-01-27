'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import CurrentlyListening from '@/components/Banners/CurrentlyListening';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import PlaylistCard from '@/components/Card/Playlist/Spotify';
import ImageWithFallback from '@/components/ImageWithFallback';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button, Icon, Tooltip } from '@/components/UI';
import { Skeleton } from '@/components/UI';
import { Dropdown, DropdownItem } from '@/components/UI/Dropdown';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { useRadius } from '@/contexts/radiusContext';
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';
import { getTimeAgo } from '@/utilities/timeAgo';

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
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

export default function SpotifyMusicContent() {
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedItem[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [dataLoading, setDataLoading] = useState({
    recentTracks: true,
    topTracks: true,
    topArtists: true,
    playlists: true,
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
        fetch(`/api/spotify/top-tracks?limit=10&time_range=${tracksTimeRange}`),
        fetch(
          `/api/spotify/top-artists?limit=10&time_range=${artistsTimeRange}`,
        ),
        fetch('/api/spotify/playlists?limit=10'),
      ]);

      if (!recentRes.ok || !topRes.ok || !artistsRes.ok || !playlistsRes.ok) {
        throw new Error('Failed to fetch some Spotify data');
      }

      const [recentData, topData, artistsData, playlistsData] =
        await Promise.all([
          recentRes.json(),
          topRes.json(),
          artistsRes.json(),
          playlistsRes.json(),
        ]);

      setRecentTracks(recentData?.items || []);
      setTopTracks(topData?.items || []);
      setTopArtists(artistsData?.items || []);
      setPlaylists(playlistsData?.items || []);

      if (recentData?.items?.[0]?.played_at) {
        setLastPlayedAt(recentData.items[0].played_at);
      }

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

  useEffect(() => {
    loadData();
  }, [loadData]);

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
            type='ghost'
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
        <CurrentlyListening showMoreButton={false} />
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
                .map((_, index) => <CardLoading key={index} type='track' />)
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
                        {getTimeAgo(lastPlayedAt)}
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
                  loadData();
                }}
              />
            </div>
            {loading.topTracks ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='track' />)
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
                  loadData();
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
                .map((_, index) => <CardLoading key={index} type='playlist' />)
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
