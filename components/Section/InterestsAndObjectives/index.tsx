import { interestsAndObjectivesData } from '@/database/interestsAndObjectives.client';
import { useRealtimeData } from '@/hooks';
import SectionTitle from '@/components/SectionTitle';
import Loading from './loading';
import { Separator } from '@/components/UI/Separator';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';

interface InterestsAndObjectivesSectionProps {
  initialData?: InterestsAndObjectives;
}

const InterestsAndObjectivesSection = ({
  initialData,
}: InterestsAndObjectivesSectionProps) => {
  const {
    data: interestsAndObjectives,
    loading,
    error,
  } = useRealtimeData(interestsAndObjectivesData, initialData);

  if (error) return <div>Failed to load interests and objectives</div>;

  return (
    <section>
      <SectionTitle
        icon='microscope'
        title='Interests & Objectives'
        loading={loading}
      />

      {loading || !interestsAndObjectives ? (
        <Loading />
      ) : (
        <div className='-mt-2 flex flex-col font-light text-muted-foreground dark:text-neutral-300'>
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
