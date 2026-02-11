import { Metadata } from 'next';

import FeedbackResponsesContent from './content';

export const metadata: Metadata = {
  title: 'Feedback Responses',
};

export default function FeedbackResponsesPage() {
  return <FeedbackResponsesContent />;
}
