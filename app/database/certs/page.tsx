import { Metadata } from 'next';
import CertificateDatabase from './content';

export const metadata: Metadata = {
  title: 'Certificates - Zulfikar',
  description: 'My licenses and certifications',
};

export default async function CertsPage() {
  return <CertificateDatabase />;
}
