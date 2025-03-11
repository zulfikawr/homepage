import { Metadata } from 'next';
import DashboardContent from './content';

export const metadata: Metadata = {
  title: 'Dashboard - Zulfikar',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
