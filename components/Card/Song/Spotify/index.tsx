import { Icon } from '@/components/UI';
import Image from 'next/image';

interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  duration?: number;
  externalUrl?: string;
}

interface SongCardProps {
  song: Song;
  onClick?: () => void;
}

const SongCard = ({ song, onClick }: SongCardProps) => {
  return (
    <div
      className='flex items-center rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200 group cursor-pointer'
      onClick={onClick}
    >
      <div className='flex items-center space-x-4 flex-1'>
        {/* Album/Track Image */}
        <div className='relative w-16 h-16 rounded-md overflow-hidden'>
          <Image
            src={song.imageUrl || '/placeholder.svg'}
            alt={song.name}
            fill
            className='object-cover'
            loading='lazy'
          />
          <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200'>
            <Icon name='playCircle' className='w-8 h-8' />
          </div>
        </div>

        {/* Song Details */}
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate'>
            {song.name}
          </h3>
          <p className='text-xs text-neutral-500 dark:text-neutral-400 truncate'>
            {song.artist}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
