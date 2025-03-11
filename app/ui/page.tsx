import { Metadata } from 'next';
import UIComponentsContent from './content';

export const metadata: Metadata = {
  title: 'UI - Zulfikar',
  description:
    'Explore all available UI components used in this website, in an interactive way.',
};

export default async function UIComponentsPage() {
  return <UIComponentsContent />;
}
