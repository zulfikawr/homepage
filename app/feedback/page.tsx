// app/feedback/page.tsx
import { Metadata } from 'next';
import FeedbackContent from './content';

export const metadata: Metadata = {
  title: 'Feedback - Zulfikar',
};

export default function DashboardPage() {
  return <FeedbackContent />;
}
