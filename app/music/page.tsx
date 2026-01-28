import { Metadata } from 'next';

import {
  getPlaylists,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
} from '@/lib/spotify';

import SpotifyMusicContent from './content';

export const metadata: Metadata = {
  title: 'Music - Zulfikar',
  description: 'My Spotify listening statistics and music preferences',
};

export default async function MusicPage() {
  const [recentData, topTracksData, topArtistsData, playlistsData] =
    await Promise.all([
      getRecentlyPlayed().catch(() => ({ items: [] })),
      getTopTracks().catch(() => ({ items: [] })),
      getTopArtists().catch(() => ({ items: [] })),
      getPlaylists().catch(() => ({ items: [] })),
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
