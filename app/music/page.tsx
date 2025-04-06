import { Metadata } from 'next';
import SpotifyMusicContent from './content';

export const metadata: Metadata = {
  title: 'Music - Zulfikar',
  description: 'My Spotify listening statistics and music preferences',
};

export default function MusicPage() {
  return <SpotifyMusicContent />;
}
