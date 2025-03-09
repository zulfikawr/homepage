// app/schedule/page.tsx
import { Metadata } from 'next';
import ScheduleContent from './content';

export const metadata: Metadata = {
  title: 'Schedule a Meeting - Zulfikar',
  description: 'Admin panel for scheduled meetings',
};

export default async function UIComponentsPage() {
  return <ScheduleContent />;
}
