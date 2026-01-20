'use client';

import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import PageTitle from '@/components/PageTitle';
import { interestsAndObjectivesData } from '@/database/interestsAndObjectives.client';
import { useRealtimeData } from '@/hooks';

export default function PersonalInfoContent() {
  const { data: interestsAndObjectives } = useRealtimeData(
    interestsAndObjectivesData,
  );

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
