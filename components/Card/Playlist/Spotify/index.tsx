import { Card } from '@/components/Card';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Icon } from '@/components/UI';
import { SpotifyPlaylist } from '@/types/spotify';
import openLink from '@/utilities/externalLink';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const handleCardClick = () => {
    openLink(playlist.external_urls.spotify);
  };

  return (
    <Card onClick={handleCardClick}>
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center aspect-square'>
          <ImageWithFallback
            width={80}
            height={80}
            src={playlist.images[0]?.url}
            alt={playlist.name}
            className='rounded-md border border-border dark:border-border shadow-sm shadow-muted dark:shadow-none'
            loading='lazy'
            type='square'
          />
        </div>
        <div className='col-span-3 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-foreground'>
            {playlist.name}
          </p>
          {playlist.description && (
            <p className='text-xs font-light text-muted-foreground line-clamp-1'>
              {playlist.description}
            </p>
          )}
          <p className='text-xs font-light text-muted-foreground'>
            {playlist.tracks?.total || 0} songs
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 text-xs font-light text-muted-foreground dark:border-border dark:text-muted-foreground'>
        <div className='flex items-center space-x-1'>
          <Icon name='spotifyLogo' className='size-4.5' />
          <span>Spotify</span>
        </div>
        <span>Listen now</span>
      </div>
    </Card>
  );
}
