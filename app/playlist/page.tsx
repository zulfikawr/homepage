import { Metadata } from 'next';
import SpotifyPlaylistContent from './spotify';

export const metadata: Metadata = {
  title: 'Playlist - Zulfikar',
  description: 'Collection of playlist I made over the years',
};

export default function PlaylistPage() {
  return <SpotifyPlaylistContent />;
}
