'use client';

import { mapRecordToInterests } from '@/lib/mappers';
import { useCollection } from '@/hooks';
import SectionTitle from '@/components/SectionTitle';
import Loading from './loading';
import { Separator } from '@/components/UI/Separator';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { useState, useEffect } from 'react';

const InterestsAndObjectivesSection = () => {
  const {
    data: allInterests,
    loading,
    error,
  } = useCollection<InterestsAndObjectives & { id: string }>(
    'interests_and_objectives',
    mapRecordToInterests,
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (allInterests.length > 0 && selectedIndex === null) {
      queueMicrotask(() =>
        setSelectedIndex(Math.floor(Math.random() * allInterests.length)),
      );
    }
  }, [allInterests, selectedIndex]);

  const interestsAndObjectives =
    selectedIndex !== null ? allInterests[selectedIndex] : null;

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
        <div className='-mt-2 flex flex-col font-light text-muted-foreground dark:text-muted-foreground'>
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
