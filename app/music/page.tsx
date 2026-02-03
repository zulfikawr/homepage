import { Metadata } from 'next';

import {
  getPlaylists,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
} from '@/lib/spotify';
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';

import SpotifyMusicContent from './content';

export const metadata: Metadata = {
  title: 'Music - Zulfikar',
  description: 'My Spotify listening statistics and music preferences',
};

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  playedAt: string;
}

export default async function MusicPage() {
  const [recentData, topTracksData, topArtistsData, playlistsData] =
    await Promise.all([
      getRecentlyPlayed().catch(() => ({
        items: [] as RecentlyPlayedItem[],
      })) as Promise<{ items: RecentlyPlayedItem[] }>,
      getTopTracks().catch(() => ({ items: [] as SpotifyTrack[] })) as Promise<{
        items: SpotifyTrack[];
      }>,
      getTopArtists().catch(() => ({
        items: [] as SpotifyArtist[],
      })) as Promise<{ items: SpotifyArtist[] }>,
      getPlaylists().catch(() => ({
        items: [] as SpotifyPlaylist[],
      })) as Promise<{ items: SpotifyPlaylist[] }>,
    ]);

  return (
    <SpotifyMusicContent
      initialRecent={recentData.items}
      initialTopTracks={topTracksData.items}
      initialTopArtists={topArtistsData.items}
      initialPlaylists={playlistsData.items}
    />
  );
}
