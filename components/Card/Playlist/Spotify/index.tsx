import Image from 'next/image';
import { Card } from '@/components/Card';
import openLink from '@/utilities/externalLink';
import { SpotifyPlaylist } from '@/types/spotifyPlaylist';
import { Icon } from '@/components/UI';

const PlaylistCard = ({
  playlist,
  isInDrawer,
}: {
  playlist: SpotifyPlaylist;
  isInDrawer?: boolean;
}) => {
  const { name, description, images, tracks, external_urls } = playlist;
  const imageUrl = images[0]?.url || '/images/placeholder.png';

  const handleClick = () => {
    if (!isInDrawer) {
      openLink(external_urls.spotify);
    }
  };

  return (
    <Card onClick={handleClick} isInDrawer={isInDrawer}>
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center aspect-square'>
          <Image
            width={80}
            height={80}
            src={imageUrl}
            alt={name}
            className='rounded-md border border-gray-300 dark:border-neutral-700 shadow-sm shadow-neutral-200 dark:shadow-none'
            loading='lazy'
          />
        </div>
        <div className='col-span-3 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {name}
          </p>
          {description && (
            <p className='text-xs font-light text-neutral-500 dark:text-neutral-400 line-clamp-1'>
              {description}
            </p>
          )}
          <p className='text-xs font-light text-neutral-500 dark:text-neutral-400'>
            {tracks.total} songs
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
};

export default PlaylistCard;
