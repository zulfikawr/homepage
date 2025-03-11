import { Metadata } from 'next';
import LoginContent from './content';

export const metadata: Metadata = {
  title: 'Login - Zulfikar',
};

export default function DashboardPage() {
  return <LoginContent />;
}
