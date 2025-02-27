import { Icon } from '~/components/UI';
import useSWR from 'swr';
import fetcher from '~/lib/fetcher';
import { InterestsAndObjectives } from '~/types/interestsAndObjectives';
import { Button } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import InterestsAndObjectivesForm from '~/components/Form/InterestsAndObjectives';
import { useAuth } from '~/contexts/authContext';

const SkeletonLoader = () => {
  return (
    <section className='mt-16'>
      <div className='flex items-center'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='microscope' />
          </span>
          <span className='uppercase'>Interests & Objectives</span>
        </label>
      </div>
      <div className='mt-[15px] flex flex-col px-1 font-light text-gray-500 underline-offset-[6px] dark:text-gray-300'>
        <div className='mb-5 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-600'></div>
        <hr className='dark:border-gray-700' />
        <div className='mt-3.5 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-600'></div>
        <ul className='mt-2 list-disc pl-5 space-y-2'>
          {[...Array(3)].map((_, index) => (
            <li key={index} className='pl-3'>
              <div className='h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-600'></div>
            </li>
          ))}
        </ul>
        <div className='mt-5 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-600'></div>
      </div>
    </section>
  );
};

const InterestsAndObjectivesSection = () => {
  const { data, error } = useSWR('/api/interestsAndObjectives', fetcher);
  const { user } = useAuth();

  if (error) return <div>Failed to load interests and objectives</div>;
  if (!data) return <SkeletonLoader />;

  const {
    interestsAndObjectives,
  }: { interestsAndObjectives: InterestsAndObjectives } = data;

  const handleEdit = () => {
    drawer.open(
      <InterestsAndObjectivesForm initialData={interestsAndObjectives} />,
    );
  };

  return (
    <section className='mt-16'>
      <div className='flex items-center justify-between'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='microscope' />
          </span>
          <span className='uppercase'>Interests & Objectives</span>
        </label>
        {user && (
          <Button type='primary' onClick={handleEdit}>
            Edit
          </Button>
        )}
      </div>
      <div className='mt-[15px] flex flex-col px-1 font-light text-gray-500 underline-offset-[6px] dark:text-gray-300'>
        <p className='mb-5'>{interestsAndObjectives.description}</p>
        <hr className='dark:border-gray-700' />
        <p className='mt-3.5'>My general objectives are to:</p>
        <ul className='mt-2 list-disc pl-5 space-y-2'>
          {interestsAndObjectives.objectives.map((objective, index) => (
            <li key={index} className='pl-3'>
              {objective}
            </li>
          ))}
        </ul>
        <p className='mt-5'>{interestsAndObjectives.conclusion}</p>
      </div>
    </section>
  );
};

export default InterestsAndObjectivesSection;
