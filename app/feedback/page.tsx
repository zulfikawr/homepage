import { Metadata } from 'next';

import FeedbackContent from './content';

export const metadata: Metadata = {
  title: 'Feedback',
};

export default function FeedbackPage() {
  return <FeedbackContent />;
}
