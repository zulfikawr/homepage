'use client';

import InterestsAndObjectivesForm from '@/components/form/interests-and-objectives';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { InterestsAndObjectivesLayout } from '@/components/section/interests-and-objectives';
import { useCollection } from '@/hooks';
import { mapRecordToInterests } from '@/lib/mappers';
import { InterestsAndObjectives } from '@/types/interests-and-objectives';

export default function InterestsAndObjectivesContent() {
  const { data: interestsAndObjectivesList, loading } = useCollection<
    InterestsAndObjectives & { id: string }
  >('interestsAndObjectives', mapRecordToInterests);

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
