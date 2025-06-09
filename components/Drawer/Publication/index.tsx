import PublicationCard from '@/components/Card/Publication';
import { Publication } from '@/types/publication';
import { drawer } from '@/components/Drawer';
import PublicationForm from '@/components/Form/Publication';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const PublicationDrawer = ({
  publications,
}: {
  publications: Publication[];
}) => {
  const handleAddPublication = () => {
    drawer.open(<PublicationForm />);
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='book' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Publications</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPublication}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      <div className='grid grid-cols-1 space-y-4 overflow-y-auto w-fit p-4 md:p-8'>
        {publications.map((publication) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            openForm
          />
        ))}
      </div>
    </>
  );
};

export default PublicationDrawer;
