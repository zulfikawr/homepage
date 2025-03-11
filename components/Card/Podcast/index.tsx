import { Podcast } from 'types/podcast';
import openLink from 'utilities/externalLink';
import Image from 'next/image';
import { Card } from 'components/Card';

export interface PodcastCardProps extends Podcast {
  isInDrawer?: boolean;
}

const PodcastCard = (props: PodcastCardProps) => {
  const { title, description, imageURL, link, isInDrawer } = props;

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) openLink(link);
      }}
      className={`${isInDrawer ? 'max-w-[13rem]' : ''}`}
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
    </Card>
  );
};

export { PodcastCard };
