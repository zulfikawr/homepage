import { Icon } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import InterestsAndObjectivesForm from '~/components/Form/InterestsAndObjectives';
import { useAuth } from '~/contexts/authContext';
import { getInterestsAndObjectives } from '~/functions/interestsAndObjectives';
import { useFetchData } from '~/lib/fetchData';

const InterestsAndObjectivesSection = () => {
  const { user } = useAuth();

  const {
    data: interestsAndObjectives,
    loading,
    error,
  } = useFetchData(getInterestsAndObjectives);

  const handleEdit = () => {
    if (interestsAndObjectives) {
      drawer.open(
        <InterestsAndObjectivesForm initialData={interestsAndObjectives} />,
      );
    }
  };

  if (error) return <div>Failed to load interests and objectives</div>;
  if (loading) return null;
  if (!interestsAndObjectives) return <div>interests and objectives</div>;

  return (
    <section>
      <div
        onClick={user ? handleEdit : undefined}
        className={`inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm ${
          user ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''
        } dark:border-gray-600 dark:bg-gray-700`}
      >
        <span className='mr-1.5 flex h-5 w-5'>
          <Icon name='microscope' />
        </span>
        <span className='uppercase'>Interests & Objectives</span>
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
