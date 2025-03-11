import { Metadata } from 'next';
import ViewScheduleContent from './content';

export const metadata: Metadata = {
  title: 'View Meeting Schedule - Zulfikar',
  description: 'Admin panel for scheduled meetings',
};

export default async function UIComponentsPage() {
  return <ViewScheduleContent />;
}
