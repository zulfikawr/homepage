import { Metadata } from 'next';
import InterestsAndObjectivesContent from './content';

export const metadata: Metadata = {
  title: 'Interests & Objectives - Zulfikar',
  description: 'Define your goals and personal focus',
};

export default function InterestsAndObjectivesPage() {
  return <InterestsAndObjectivesContent />;
}
