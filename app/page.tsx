import { Metadata } from 'next';
import Home from './home';

export const metadata: Metadata = {
  title: 'Home - Zulfikar',
  description: 'Personal website and portfolio of Zulfikar',
};

export default function HomePage() {
  return <Home />;
}
