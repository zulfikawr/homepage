import { PodcastCard } from '@/components/Card/Podcast';
import { Podcast } from '@/types/podcast';
import { drawer } from '@/components/Drawer';
import PodcastForm from '@/components/Form/Podcast';
import { Button } from '@/components/UI';

const PodcastDrawer = ({
  podcasts,
  onUpdate,
}: {
  podcasts: Podcast[];
  onUpdate: () => Promise<void>;
}) => {
  const handleEditPodcast = (podcast: Podcast) => {
    drawer.open(<PodcastForm podcastToEdit={podcast} onUpdate={onUpdate} />);
  };

  const handleAddPodcast = () => {
    drawer.open(<PodcastForm onUpdate={onUpdate} />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Podcasts</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPodcast}>
              <span className='hidden lg:block'>Add Podcast</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 overflow-y-auto w-fit p-4'>
        {podcasts.map((podcast, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditPodcast(podcast);
            }}
            className='cursor-pointer'
          >
            <PodcastCard {...podcast} isInDrawer />
          </div>
        ))}
      </div>
    </>
  );
};

export default PodcastDrawer;
