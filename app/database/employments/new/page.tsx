import { Metadata } from 'next';
import NewEmploymentContent from './content';

export const metadata: Metadata = {
  title: 'Add Employment - Zulfikar',
  description: 'Add a new employment',
};

export default function NewEmploymentPage() {
  return <NewEmploymentContent />;
}
