import { Podcast } from '~/types/podcast';
import openLink from '~/utilities/externalLink';
import { drawer } from '~/components/Drawer';
import PodcastForm from '~/components/Form/Podcast';
import { Button } from '~/components/UI';
import { useAuth } from '~/contexts/authContext';
import Image from 'next/image';

const PodcastCard = (props: Podcast & { isInDrawer?: boolean }) => {
  const { title, description, imageURL, link, isInDrawer } = props;

  const { user } = useAuth();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    drawer.open(<PodcastForm podcastToEdit={props} />);
  };

  return (
    <div
      className={`relative group z-40 flex ${isInDrawer ? 'w-56' : 'w-full'} cursor-${isInDrawer ? 'default' : 'pointer'} flex-col rounded-md border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none`}
      onClick={() => {
        if (!isInDrawer) openLink(link);
      }}
    >
      <div className='h-full overflow-hidden rounded-[5px] opacity-100 lg:group-hover:opacity-0'>
        <div className='h-auto w-full border-b bg-gray-200 dark:border-gray-700 dark:bg-gray-800 lg:h-[196px]'>
          <Image
            className='z-10 h-full w-full rounded-tl-md rounded-tr-md'
            src={imageURL}
            alt={title}
            width={200}
            height={200}
          />
        </div>
        <div className='px-3.5 pb-5 pt-4.5'>
          <h2 className='text-normal mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-medium tracking-wider'>
            {title}
          </h2>
          <p
            className='line-clamp-2 text-sm leading-snug tracking-wide text-gray-600 dark:text-gray-400'
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
      </div>
      <div className='absolute left-5 top-8 hidden h-full w-40 overflow-hidden rounded-md opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 lg:block'>
        <div className='translate-y-1 transition-all duration-300 ease-in-out group-hover:translate-y-0'>
          <Image
            className='mb-2 h-10 w-10 rounded-md border border-gray-600'
            src={imageURL}
            alt={title}
            width={40}
            height={40}
          />
          <h2 className='mb-1 text-sm font-bold tracking-wider text-black dark:text-white'>
            {title}
          </h2>
          <p
            className='line-clamp-2 text-xs font-medium leading-snug tracking-wide text-gray-800 group-hover:line-clamp-none dark:text-gray-300'
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-gray-100 px-4.5 py-2 text-xs font-light text-gray-500 dark:border-gray-700 dark:text-gray-400'>
        <span>Podcast</span>
        <span>Listen Now</span>
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

export { PodcastCard };
