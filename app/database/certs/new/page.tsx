import { Metadata } from 'next';
import NewCertificateContent from './content';

export const metadata: Metadata = {
  title: 'Add Certificate - Zulfikar',
  description: 'Add a new license or certification',
};

export default function NewCertificatePage() {
  return <NewCertificateContent />;
}
