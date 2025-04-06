import PodcastCard from '@/components/Card/Podcast';
import { Podcast } from '@/types/podcast';
import { drawer } from '@/components/Drawer';
import PodcastForm from '@/components/Form/Podcast';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const PodcastDrawer = ({ podcasts }: { podcasts: Podcast[] }) => {
  const handleAddPodcast = () => {
    drawer.open(<PodcastForm />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='microphone' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Podcasts</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPodcast}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 overflow-y-auto w-fit p-4'>
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} isInDrawer />
        ))}
      </div>
    </>
  );
};

export default PodcastDrawer;
