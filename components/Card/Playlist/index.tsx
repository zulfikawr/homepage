import Image from 'next/image';
import { Playlist } from 'types/playlist';
import openLink from 'utilities/externalLink';
import { Button } from 'components/UI';
import { drawer } from 'components/Drawer';
import PlaylistForm from 'components/Form/Playlist';
import { useAuth } from 'contexts/authContext';

const PlaylistCard = (props: Playlist & { isInDrawer?: boolean }) => {
  const { id, name, description, imageUrl, dateCreated, songs, isInDrawer } =
    props;

  const { user } = useAuth();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    drawer.open(<PlaylistForm playlistToEdit={props} />);
  };

  return (
    <div
      className={`relative group z-40 flex cursor-${isInDrawer ? 'default' : 'pointer'} flex-col rounded-md border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none`}
      onClick={() => {
        if (!isInDrawer) openLink(`/playlist/${id}`);
      }}
    >
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center'>
          <Image
            width={80}
            height={80}
            src={imageUrl || '/images/placeholder.png'}
            alt={name}
            className='rounded-md border shadow-sm shadow-gray-200 dark:shadow-none'
            loading='lazy'
          />
        </div>
        <div className='col-span-3 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {name}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-gray-500 dark:text-gray-400 lg:text-sm'>
            {description}
          </p>
          <p className='text-xs font-light text-gray-500 dark:text-gray-400'>
            {songs?.length || 0} songs
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-gray-100 px-4.5 py-2 text-xs font-light text-gray-500 dark:border-gray-700 dark:text-gray-400'>
        <span>Date Created</span>
        <span>{dateCreated}</span>
      </div>
      {user && !isInDrawer && (
        <div className='absolute top-2 right-2 hidden group-hover:flex'>
          <Button type='primary' onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;
