'use client';

import { useMemo } from 'react';

import ResumeForm from '@/components/Form/Resume';
import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { useCollection } from '@/hooks';
import { mapRecordToResume } from '@/lib/mappers';
import { Resume } from '@/types/resume';

export default function ResumeContent() {
  const { data: resumeList } = useCollection<Resume>(
    'resume',
    mapRecordToResume,
  );

  const resume = useMemo(() => {
    return resumeList && resumeList.length > 0 ? resumeList[0] : undefined;
  }, [resumeList]);

  return (
    <div>
      <PageTitle emoji='📄' title='Resume' subtitle='Update your resume' />

      <ViewTransition>
        <ResumeForm data={resume} />
      </ViewTransition>
    </div>
  );
}
