'use client';

import Link from 'next/link';

import ImageWithFallback from '@/components/image-with-fallback';
import { Tooltip } from '@/components/ui';
import { useRadius } from '@/contexts/radius-context';
import { SpotifyTrack } from '@/types/spotify';

interface TrackRowProps {
  track: SpotifyTrack;
  trailing: string;
  index?: number;
  compactIndex?: boolean;
}

export default function TrackRow({
  track,
  trailing,
  index,
  compactIndex = false,
}: TrackRowProps) {
  const { radius } = useRadius();

  return (
    <div
      className='flex items-center gap-4 py-4 px-2 md:px-6 hover:bg-muted/50 transition-colors'
      style={{ borderRadius: `${radius}px` }}
    >
      {!compactIndex && (
        <span className='hidden md:flex text-muted-foreground w-5 text-sm'>
          {index !== undefined ? index + 1 : ''}
        </span>
      )}
      <div className='flex-shrink-0'>
        <Tooltip text={track.album.name}>
          <ImageWithFallback
            src={track.album.images[0]?.url}
            alt={track.album.name}
            width={48}
            height={48}
            type='square'
            sizes='48px'
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
          {track.artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
      <div className='text-xs text-muted-foreground whitespace-nowrap flex-shrink-0'>
        {trailing}
      </div>
    </div>
  );
}
