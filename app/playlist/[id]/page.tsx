import { getPlaylists } from '@/functions/playlists';
import { Metadata } from 'next';
import PlaylistContent from './content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Playlist - Zulfikar',
  };
}

export async function generateStaticParams() {
  try {
    const playlists = await getPlaylists();
    return playlists.map((playlist) => ({
      id: playlist.id,
    }));
  } catch (error) {
    console.error('Error generating playlist params:', error);
    return [];
  }
}

export default function PlaylistPage() {
  return <PlaylistContent />;
}
