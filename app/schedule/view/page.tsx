// app/schedule/page.tsx
import { Metadata } from 'next';
import ViewScheduleContent from './content';

export const metadata: Metadata = {
  title: 'View Meeting Schedule - Zulfikar',
  description: 'Schedule a meeting with Zulfikar',
};

export default async function UIComponentsPage() {
  return <ViewScheduleContent />;
}
