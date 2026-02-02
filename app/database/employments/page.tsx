import { Metadata } from 'next';

import EmploymentsContent from './content';

export const metadata: Metadata = {
  title: 'Employments - Zulfikar',
  description: 'My professional experiences',
};

export default async function EmploymentPage() {
  return <EmploymentsContent />;
}
