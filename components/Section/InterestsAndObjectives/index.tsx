'use client';

import { useEffect, useState } from 'react';

import CardEmpty from '@/components/Card/Empty';
import SectionTitle from '@/components/SectionTitle';
import { Skeleton } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { useCollection } from '@/hooks';
import { mapRecordToInterests } from '@/lib/mappers';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';

export const InterestsAndObjectivesLayout = ({
  data,
  isLoading = false,
}: {
  data?: InterestsAndObjectives;
  isLoading?: boolean;
}) => {
  return (
    <section>
      <SectionTitle
        icon='microscope'
        title='Interests & Objectives'
        loading={isLoading}
      />

      <div className='-mt-2 flex flex-col font-light text-muted-foreground dark:text-muted-foreground'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton width='100%' height={16} />
            <Skeleton width='100%' height={16} />
            <Skeleton width='16.6%' height={16} />
          </div>
        ) : (
          <p>{data?.description}</p>
        )}

        <Separator margin='4' />

        <div className='h-6 flex items-center'>
          {isLoading ? (
            <Skeleton width={192} height={16} />
          ) : (
            <p>My general objectives are to:</p>
          )}
        </div>

        <ul className='mt-2 list-disc pl-5 space-y-2'>
          {isLoading
            ? [1, 2, 3].map((i) => (
                <li key={i} className='pl-3'>
                  <Skeleton width='80%' height={16} />
                </li>
              ))
            : data?.objectives.map((objective, index) => (
                <li key={index} className='pl-3'>
                  {objective}
                </li>
              ))}
        </ul>

        <div className='mt-5 space-y-3'>
          {isLoading ? (
            <>
              <Skeleton width='100%' height={16} />
              <Skeleton width='80%' height={16} />
            </>
          ) : (
            <p>{data?.conclusion}</p>
          )}
        </div>
      </div>
    </section>
  );
};

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

  if (loading || (!interestsAndObjectives && allInterests.length > 0)) {
    return <InterestsAndObjectivesLayout isLoading={true} />;
  }

  if (allInterests.length === 0) {
    return (
      <section>
        <SectionTitle icon='microscope' title='Interests & Objectives' />
        <CardEmpty message='No interests and objectives found.' />
      </section>
    );
  }

  return (
    <InterestsAndObjectivesLayout
      data={interestsAndObjectives!}
      isLoading={false}
    />
  );
};

export default InterestsAndObjectivesSection;
