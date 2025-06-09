import { Metadata } from 'next';
import NewProjectContent from './content';

export const metadata: Metadata = {
  title: 'Add Post - Zulfikar',
  description: 'Add a new post',
};

export default function NewProjectPage() {
  return <NewProjectContent />;
}
