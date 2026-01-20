'use client';

import PersonalInfoForm from '@/components/Form/PersonalInfo';
import PageTitle from '@/components/PageTitle';
import { mapRecordToPersonalInfo } from '@/lib/mappers';
import { useCollection } from '@/hooks';
import { PersonalInfo } from '@/types/personalInfo';

export default function PersonalInfoContent() {
  const { data: personalInfoList } = useCollection<PersonalInfo>(
    'profile',
    mapRecordToPersonalInfo,
  );

  const personalInfo =
    personalInfoList && personalInfoList.length > 0
      ? personalInfoList[0]
      : undefined;

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
