import { Metadata } from 'next';
import CertificatesContent from './content';

export const metadata: Metadata = {
  title: 'Certificates - Zulfikar',
  description: 'My certifications and achievements',
};

export default async function CertificatesPage() {
  return <CertificatesContent />;
}
