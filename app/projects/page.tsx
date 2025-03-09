import { Metadata } from 'next';
import ProjectsContent from './content';

export const metadata: Metadata = {
  title: 'Projects - Zulfikar',
  description:
    "I'm reading or re-reading (on average) one book every month in 2024",
};

export default async function ReadingListPage() {
  return <ProjectsContent />;
}
