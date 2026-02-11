import { Metadata } from 'next';

import NewProjectContent from './content';

export const metadata: Metadata = {
  title: 'Add Project',
  description: 'Add a new project',
};

export default function NewProjectPage() {
  return <NewProjectContent />;
}
