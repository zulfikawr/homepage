import { Metadata } from 'next';

import PersonalInfoContent from './content';

export const metadata: Metadata = {
  title: 'Personal Info',
  description: 'Manage your profile',
};

export default async function PersonalInfoPage() {
  return <PersonalInfoContent />;
}
