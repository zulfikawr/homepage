'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button, Dropdown, Icon, Tooltip } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import {
  getAccessToken,
  getRecentlyPlayed,
  getTopTracks,
  getTopArtists,
  getPlaylists,
} from '@/lib/spotify';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';
import { getTimeAgo } from '@/utilities/timeAgo';
import CurrentlyListening from '@/components/Banners/CurrentlyListening';
import PlaylistCard from '@/components/Card/Playlist/Spotify';
import ImageWithFallback from '@/components/ImageWithFallback';
import { formatDate } from '@/utilities/formatDate';
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';

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
  const [loading, setLoading] = useState({
    recentTracks: true,
    topTracks: true,
    topArtists: true,
    playlists: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'recent' | 'top' | 'artists' | 'playlists'
  >('recent');
  const [tracksTimeRange, setTracksTimeRange] =
    useState<TimeRange>('short_term');
  const [artistsTimeRange, setArtistsTimeRange] =
    useState<TimeRange>('short_term');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const [recentData, topData, artistsData, playlistsData] =
        await Promise.all([
          getRecentlyPlayed(),
          getTopTracks(tracksTimeRange),
          getTopArtists(artistsTimeRange),
          getPlaylists(),
        ]);

      setRecentTracks(recentData?.items || []);
      setTopTracks(topData?.items || []);
      setTopArtists(artistsData?.items || []);
      setPlaylists(playlistsData?.items || []);

      if (recentData?.items?.[0]?.played_at) {
        setLastPlayedAt(
          formatDate(recentData.items[0].played_at, {
            includeDay: true,
          }),
        );
      }

      setLoading({
        recentTracks: false,
        topTracks: false,
        topArtists: false,
        playlists: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading({
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
      <div className='p-4 text-red-500'>
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
          <button className='w-32 flex items-center justify-end gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'>
            {timeRangeOptions.find((opt) => opt.value === value)?.label}
            <Icon name='caretDown' className='size-4' />
          </button>
        }
        matchTriggerWidth
      >
        <div className='p-1 space-y-1'>
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                value === option.value
                  ? 'bg-neutral-100 dark:bg-neutral-700 text-green-600 dark:text-green-400'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={() => onChange(option.value as TimeRange)}
            >
              {option.label}
            </button>
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
        route='/music'
      />

      {/* Currently Playing Section */}
      <div className='mt-8'>
        <CurrentlyListening />
      </div>

      {/* Tabs Navigation */}
      <div className='mt-8 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto scrollbar-hide'>
        <nav className='flex space-x-8 min-w-max'>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'recent'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Icon name='playCircle' className='size-5' />
            Recently Played
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'top'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Icon name='musicNotes' className='size-5' />
            Top Tracks
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'artists'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Icon name='userCircle' className='size-5' />
            Top Artists
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'playlists'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
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
              Array(5)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='track' />)
            ) : recentTracks.length > 0 ? (
              recentTracks.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 py-4 px-2 md:px-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-md transition-colors'
                >
                  <span className='hidden md:flex text-neutral-400 dark:text-neutral-500 w-5 text-sm'>
                    {index + 1}
                  </span>
                  <div className='flex-shrink-0'>
                    <Tooltip text={item.track.album.name}>
                      <ImageWithFallback
                        src={item.track.album.images[0]?.url}
                        alt={item.track.album.name}
                        width={48}
                        height={48}
                        className='rounded-md'
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
                    <p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(', ')}
                    </p>
                  </div>
                  <div className='text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap flex-shrink-0'>
                    {getTimeAgo(lastPlayedAt)}
                  </div>
                </div>
              ))
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
              Array(5)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='track' />)
            ) : topTracks.length > 0 ? (
              topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className='flex items-center gap-4 py-4 px-2 md:px-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-md transition-colors'
                >
                  <span className='hidden md:flex text-neutral-400 dark:text-neutral-500 w-5 text-sm'>
                    {index + 1}
                  </span>
                  <div className='flex-shrink-0'>
                    <Tooltip text={track.album.name}>
                      <ImageWithFallback
                        src={track.album.images[0]?.url}
                        alt={track.album.name}
                        width={48}
                        height={48}
                        className='rounded-md'
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
                    <p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                  <div className='text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap flex-shrink-0'>
                    {formatDuration(track.duration_ms)}
                  </div>
                </div>
              ))
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
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center space-y-2 p-3'
                    >
                      <div className='h-24 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700' />
                      <div className='h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
                    </div>
                  ))
              ) : topArtists.length > 0 ? (
                topArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={artist.external_urls.spotify}
                    target='_blank'
                    className='flex flex-col items-center space-y-2 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-md transition-colors'
                  >
                    <ImageWithFallback
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      width={96}
                      height={96}
                      className='rounded-full object-cover aspect-square'
                      type='square'
                    />
                    <h3 className='font-medium text-center'>{artist.name}</h3>
                  </Link>
                ))
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
              Array(4)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='playlist' />)
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))
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
