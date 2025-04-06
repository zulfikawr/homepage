import { Podcast } from '@/types/podcast';
import openLink from '@/utilities/externalLink';
import { Card } from '@/components/Card';
import ImageWithFallback from '@/components/ImageWithFallback';
import { drawer } from '@/components/Drawer';
import PodcastForm from '@/components/Form/Podcast';

interface PodcastCardProps {
  podcast: Podcast;
  isInDrawer?: boolean;
  isInForm?: boolean;
}

export default function PodcastCard({
  podcast,
  isInDrawer,
  isInForm,
}: PodcastCardProps) {
  const handleCardClick = () => {
    if (isInForm) return;

    if (isInDrawer) {
      drawer.open(<PodcastForm podcastToEdit={podcast} />);
    } else {
      openLink(podcast.link);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`${isInDrawer ? 'max-w-[13rem]' : ''}`}
      isInDrawer={isInDrawer}
      isInForm={isInForm}
    >
      <div className='h-full overflow-hidden rounded-[5px] opacity-100 lg:group-hover:opacity-0'>
        <div className='h-auto w-full border-b bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 lg:h-[196px]'>
          <ImageWithFallback
            className='z-10 h-full w-full rounded-tl-md rounded-tr-md'
            src={podcast.imageURL}
            alt={podcast.title}
            width={200}
            height={200}
            type='square'
          />
        </div>
        <div className='px-3.5 pb-5 pt-4.5'>
          <h2 className='text-normal mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-medium tracking-wider'>
            {podcast.title}
          </h2>
          <p
            className='line-clamp-2 text-sm leading-snug tracking-wide text-neutral-600 dark:text-neutral-400'
            dangerouslySetInnerHTML={{
              __html: podcast.description,
            }}
          />
        </div>
      </div>
      <div className='absolute left-5 top-8 hidden h-full w-40 overflow-hidden rounded-md opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 lg:block'>
        <div className='translate-y-1 transition-all duration-300 ease-in-out group-hover:translate-y-0'>
          <ImageWithFallback
            src={podcast.imageURL}
            alt={podcast.title}
            width={40}
            height={40}
            className='mb-2 h-10 w-10 rounded-md border border-neutral-600'
            type='square'
          />
          <h2 className='mb-1 text-sm font-bold tracking-wider text-black dark:text-white'>
            {podcast.title}
          </h2>
          <p
            className='line-clamp-2 text-xs font-medium leading-snug tracking-wide text-neutral-800 group-hover:line-clamp-none dark:text-neutral-300'
            dangerouslySetInnerHTML={{
              __html: podcast.description,
            }}
          />
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <span>Podcast</span>
        <span>Listen Now</span>
      </div>
    </Card>
  );
}
