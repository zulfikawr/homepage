'use client';

import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { InterestsAndObjectivesLayout } from '@/components/Section/InterestsAndObjectives';
import { useCollection } from '@/hooks';
import { mapRecordToInterests } from '@/lib/mappers';
import { InterestsAndObjectives } from '@/types/interests_and_objectives';

export default function InterestsAndObjectivesContent() {
  const { data: interestsAndObjectivesList, loading } = useCollection<
    InterestsAndObjectives & { id: string }
  >('interests_and_objectives', mapRecordToInterests);

  const interestsAndObjectives =
    interestsAndObjectivesList && interestsAndObjectivesList.length > 0
      ? interestsAndObjectivesList[0]
      : undefined;

  if (loading) {
    return (
      <div>
        <PageTitle
          emoji='🎯'
          title='Interest and Objectives'
          subtitle='Define your goal and personal focus.'
          isLoading={true}
        />
        <InterestsAndObjectivesLayout isLoading={true} />
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        emoji='🎯'
        title='Interest and Objectives'
        subtitle='Define your goal and personal focus.'
      />

      <ViewTransition>
        <InterestsAndObjectivesForm data={interestsAndObjectives} />
      </ViewTransition>
    </div>
  );
}
