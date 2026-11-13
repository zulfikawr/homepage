'use client';

import Link from 'next/link';

import ImageWithFallback from '@/components/image-with-fallback';
import { useRadius } from '@/contexts/radius-context';
import { SpotifyArtist } from '@/types/spotify';

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const { radius } = useRadius();

  return (
    <Link
      href={artist.external_urls.spotify}
      target='_blank'
      className='flex flex-col items-center space-y-2 p-3 hover:bg-muted/50 transition-colors'
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
      <h3 className='font-medium text-center'>{artist.name}</h3>
    </Link>
  );
}
