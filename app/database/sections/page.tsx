import { Metadata } from 'next';

import { getBannerNodes } from '@/components/section/banners';
import { getBannerSettings } from '@/database/banners';

import SectionDatabase from './content';

export const metadata: Metadata = {
  title: 'Sections',
  description: 'Manage homepage sections order and visibility',
};

export default async function SectionPage() {
  const bannerSettings = await getBannerSettings();
  const bannerNodes = getBannerNodes();

  return (
    <SectionDatabase
      bannerNodes={bannerNodes}
      initialBannerSettings={bannerSettings}
    />
  );
}
