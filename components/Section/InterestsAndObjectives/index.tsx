import { drawer } from '@/components/Drawer';
import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import { useAuth } from '@/contexts/authContext';
import { getInterestsAndObjectives } from '@/functions/interestsAndObjectives';
import { useFetchData } from '@/lib/fetchData';
import SectionTitle from '@/components/SectionTitle';
import Loading from './loading';
import Separator from '@/components/UI/Separator';

const InterestsAndObjectivesSection = () => {
  const { user } = useAuth();

  const {
    data: interestsAndObjectives,
    loading,
    error,
    refetch,
  } = useFetchData(getInterestsAndObjectives);

  const handleEdit = () => {
    if (interestsAndObjectives) {
      drawer.open(
        <InterestsAndObjectivesForm
          data={interestsAndObjectives}
          onUpdate={refetch}
        />,
      );
    }
  };

  if (error) return <div>Failed to load interests and objectives</div>;

  return (
    <section>
      <SectionTitle
        icon='microscope'
        title='Interests & Objectives'
        onClick={handleEdit}
        isClickable={!!user}
      />

      {loading ? (
        <Loading />
      ) : (
        <div className='-mt-2 flex flex-col font-light text-gray-500 dark:text-gray-300'>
          <p>{interestsAndObjectives.description}</p>
          <Separator margin='4' />
          <p>My general objectives are to:</p>
          <ul className='mt-2 list-disc pl-5 space-y-2'>
            {interestsAndObjectives.objectives.map((objective, index) => (
              <li key={index} className='pl-3'>
                {objective}
              </li>
            ))}
          </ul>
          <p className='mt-5'>{interestsAndObjectives.conclusion}</p>
        </div>
      )}
    </section>
  );
};

export default InterestsAndObjectivesSection;
