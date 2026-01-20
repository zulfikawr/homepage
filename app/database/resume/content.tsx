'use client';

import ResumeForm from '@/components/Form/Resume';
import PageTitle from '@/components/PageTitle';
import { resumeData } from '@/database/resume.client';
import { useRealtimeData } from '@/hooks';

export default function ResumeContent() {
  const { data: resume } = useRealtimeData(resumeData);

  return (
    <div>
      <PageTitle emoji='📄' title='Resume' subtitle='Update your resume' />

      <ResumeForm data={resume} />
    </div>
  );
}
