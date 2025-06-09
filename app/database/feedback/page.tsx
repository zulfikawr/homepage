import { Metadata } from 'next';
import FeedbackResponsesContent from './content';

export const metadata: Metadata = {
  title: 'Feedback Responses - Zulfikar',
};

export default function FeedbackResponsesPage() {
  return <FeedbackResponsesContent />;
}
