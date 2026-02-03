'use client';

import { useMemo } from 'react';

import ResumeForm from '@/components/form/resume';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
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
