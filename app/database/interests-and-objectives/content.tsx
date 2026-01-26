'use client';

import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { useCollection } from '@/hooks';
import { mapRecordToInterests } from '@/lib/mappers';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';

export default function PersonalInfoContent() {
  const { data: interestsAndObjectivesList } = useCollection<
    InterestsAndObjectives & { id: string }
  >('interests_and_objectives', mapRecordToInterests);

  const interestsAndObjectives =
    interestsAndObjectivesList && interestsAndObjectivesList.length > 0
      ? interestsAndObjectivesList[0]
      : undefined;

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
