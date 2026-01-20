'use client';

import ResumeForm from '@/components/Form/Resume';
import PageTitle from '@/components/PageTitle';
import { mapRecordToResume } from '@/lib/mappers';
import { useCollection } from '@/hooks';
import { Resume } from '@/types/resume';
import { useMemo } from 'react';

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

      <ResumeForm data={resume} />
    </div>
  );
}
