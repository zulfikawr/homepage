'use client';

import PersonalInfoForm from '@/components/form/personal-info';
import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { PersonalInfoLayout } from '@/components/section/personal-info';
import { useCollection } from '@/hooks';
import { mapRecordToPersonalInfo } from '@/lib/mappers';
import { PersonalInfo } from '@/types/personal-info';

export default function PersonalInfoContent() {
  const { data: personalInfoList, loading } = useCollection<PersonalInfo>(
    'profile',
    mapRecordToPersonalInfo,
  );

  const personalInfo =
    personalInfoList && personalInfoList.length > 0
      ? personalInfoList[0]
      : undefined;

  if (loading) {
    return (
      <div>
        <PageTitle
          emoji='👤'
          title='Personal Info'
          subtitle='Manage your profile'
          isLoading={true}
        />
        <PersonalInfoLayout isLoading={true} />
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        emoji='👤'
        title='Personal Info'
        subtitle='Manage your profile'
      />

      <ViewTransition>
        <PersonalInfoForm data={personalInfo} />
      </ViewTransition>
    </div>
  );
}
