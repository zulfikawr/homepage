import { Metadata } from 'next';

import { getBannerNodes } from '@/components/section/banners';

import SectionDatabase from './content';

export const metadata: Metadata = {
  title: 'Sections',
  description: 'Manage homepage sections order and visibility',
};

export default function SectionPage() {
  const bannerNodes = getBannerNodes();

  return <SectionDatabase bannerNodes={bannerNodes} />;
}
