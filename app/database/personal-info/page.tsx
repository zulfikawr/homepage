import { Metadata } from 'next';

import PersonalInfoContent from './content';

export const metadata: Metadata = {
  title: 'Personal Info - Zulfikar',
  description: 'Manage your profile',
};

export default async function PersonalInfoPage() {
  return <PersonalInfoContent />;
}
