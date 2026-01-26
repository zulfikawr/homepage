import { Metadata } from 'next';

import ContactsContent from './content';

export const metadata: Metadata = {
  title: 'Contacts - Zulfikar',
};

export default function ContactsPage() {
  return <ContactsContent />;
}
