import { Metadata } from 'next';
import ScheduleContent from './content';

export const metadata: Metadata = {
  title: 'Schedule a Meeting - Zulfikar',
  description: 'Schedule a meeting with Zulfikar',
};

export default async function UIComponentsPage() {
  return <ScheduleContent />;
}
