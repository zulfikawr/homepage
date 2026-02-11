import { Metadata } from 'next';

import UIContent from './content';

export const metadata: Metadata = {
  title: 'UI Components',
  description:
    'A showcase of the design system and UI components used in this website.',
};

export default function UIPage() {
  return <UIContent />;
}
