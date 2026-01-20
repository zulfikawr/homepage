'use client';

import PersonalInfoForm from '@/components/Form/PersonalInfo';
import PageTitle from '@/components/PageTitle';
import { personalInfoData } from '@/database/personalInfo.client';
import { useRealtimeData } from '@/hooks';

export default function PersonalInfoContent() {
  const { data: personalInfo } = useRealtimeData(personalInfoData);

  return (
    <div>
      <PageTitle
        emoji='👤'
        title='Personal Info'
        subtitle='Manage your profile'
      />

      <PersonalInfoForm data={personalInfo} />
    </div>
  );
}
