import { Metadata } from 'next';
import SectionDatabase from './content';

export const metadata: Metadata = {
  title: 'Sections - Zulfikar',
  description: 'Manage homepage sections order and visibility',
};

export default async function SectionPage() {
  return <SectionDatabase />;
}
