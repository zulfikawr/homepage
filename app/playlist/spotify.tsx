'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import PlaylistCard from '@/components/Card/Playlist/Spotify';
import { getAccessToken } from '@/lib/spotify';
import { SpotifyPlaylist } from '@/types/spotifyPlaylist';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';

export default function SpotifyPlaylistContent() {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyPlaylists = async () => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(
        'https://api.spotify.com/v1/me/playlists?limit=50',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
      return [];
    }
  };

  const loadPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPlaylists = await fetchSpotifyPlaylists();
      setPlaylists(fetchedPlaylists);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        {error}
        <Button onClick={loadPlaylists} className='ml-4'>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        emoji='🎵'
        title='Playlists'
        subtitle='My curated Spotify playlists'
        route='/playlist'
      />

      {loading ? (
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <CardLoading key={index} type='playlist' />
            ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className='mt-8 rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          <CardEmpty message='No playlist found' />
        </div>
      )}
    </div>
  );
}
