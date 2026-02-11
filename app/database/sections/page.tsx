import { Metadata } from 'next';

import SectionDatabase from './content';

export const metadata: Metadata = {
  title: 'Sections',
  description: 'Manage homepage sections order and visibility',
};

export default async function SectionPage() {
  return <SectionDatabase />;
}
