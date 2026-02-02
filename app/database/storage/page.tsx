import { Metadata } from 'next';

import StorageContent from './content';

export const metadata: Metadata = {
  title: 'Storage Manager - Zulfikar',
  description: 'Manage files and folders in R2 storage.',
};

export default function StoragePage() {
  return <StorageContent />;
}
