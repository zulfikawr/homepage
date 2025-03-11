import { Metadata } from 'next';
import PodcastContent from './content';

export const metadata: Metadata = {
  title: 'Podcasts - Zulfikar',
  description:
    'Collection of podcasts I have enjoyed listening to over the years',
};

export default function PodcastPage() {
  return <PodcastContent />;
}
