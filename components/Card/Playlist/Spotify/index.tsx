import { Card } from '@/components/Card';
import openLink from '@/utilities/externalLink';
import { SpotifyPlaylist } from '@/types/spotify';
import { Icon } from '@/components/UI';
import ImageWithFallback from '@/components/ImageWithFallback';

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
            className='rounded-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none'
            loading='lazy'
            type='square'
          />
        </div>
        <div className='col-span-3 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {playlist.name}
          </p>
          {playlist.description && (
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400 line-clamp-1'>
              {playlist.description}
            </p>
          )}
          <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
            {playlist.tracks?.total || 0} songs
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <div className='flex items-center space-x-1'>
          <Icon name='spotifyLogo' className='size-4.5' />
          <span>Spotify</span>
        </div>
        <span>Listen now</span>
      </div>
    </Card>
  );
}
