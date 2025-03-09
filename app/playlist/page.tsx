// app/playlist/page.tsx
import { Metadata } from 'next';
import PlaylistContent from './content';

export const metadata: Metadata = {
  title: 'Playlist - Zulfikar',
  description: 'Collection of playlist I made over the years',
};

export default function PlaylistPage() {
  return <PlaylistContent />;
}
