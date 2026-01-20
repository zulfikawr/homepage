'use client';

import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import PageTitle from '@/components/PageTitle';
import { mapRecordToInterests } from '@/lib/mappers';
import { useCollection } from '@/hooks';
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

      <InterestsAndObjectivesForm data={interestsAndObjectives} />
    </div>
  );
}
