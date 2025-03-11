import PageTitle from '@/components/PageTitle';
import { Icon } from '@/components/UI';
import Link from 'next/link';

interface ContactItem {
  platform: string;
  link: string;
  username: string;
  icon: string;
  color: string;
}

const contacts: ContactItem[] = [
  {
    platform: 'Email',
    link: 'mailto:zulfikawr@gmail.com',
    username: 'zulfikawr@gmail.com',
    icon: 'envelope',
    color: 'text-red-500',
  },
  {
    platform: 'GitHub',
    link: 'https://github.com/zulfikawr',
    username: '@zulfikawr',
    icon: 'github',
    color: 'text-black dark:text-white',
  },
  {
    platform: 'LinkedIn',
    link: 'https://linkedin.com/in/zulfikar-muhammad',
    username: 'Muhammad Zulfikar',
    icon: 'linkedin',
    color: 'text-blue-600',
  },
  {
    platform: 'WhatsApp',
    link: 'https://wa.me/+6285156453730',
    username: '+62 851 5645 3730',
    icon: 'whatsapp',
    color: 'text-green-500',
  },
];

export default function ContactsContent() {
  return (
    <div>
      <PageTitle
        emoji='📞'
        title='Contacts'
        subtitle="Let's connect! Here are the best ways to reach me."
        route='/contacts'
      />

      <div className='grid gap-4 sm:grid-cols-2'>
        {contacts.map((contact) => (
          <Link
            key={contact.platform}
            href={contact.link}
            target='_blank'
            rel='noopener noreferrer'
            className='flex cursor-pointer gap-4 items-center rounded-md border bg-white px-4 pb-4 pt-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none'
          >
            <div
              className={`flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 ${contact.color}`}
            >
              <Icon name={contact.icon} className='size-5' />
            </div>
            <div>
              <h3 className='font-medium'>{contact.platform}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {contact.username}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='mt-8 rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <h2 className='mb-2 text-lg font-medium'>Direct Message</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Prefer to send a private message? Feel free to use the{' '}
          <a
            href='/feedback'
            className='text-blue-600 hover:underline dark:text-blue-400'
          >
            feedback form
          </a>{' '}
          or reach out through any of the platforms above.
        </p>
      </div>
    </div>
  );
}
