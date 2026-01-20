import { Metadata } from 'next';
import ResumeContent from './content';

export const metadata: Metadata = {
  title: 'Resume - Zulfikar',
  description: 'Update your resume',
};

export default async function ResumePage() {
  return <ResumeContent />;
}
