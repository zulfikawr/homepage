import NavigationCard from '@/components/Card/Navigation';
import PageTitle from '@/components/PageTitle';

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
        {contacts.map((contact, index) => (
          <NavigationCard
            key={index}
            title={contact.platform}
            desc={contact.username}
            icon={contact.icon}
            className={contact.color}
            href={contact.link}
          />
        ))}
      </div>

      <div className='mt-8 rounded-lg border bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800'>
        <h2 className='mb-2 text-lg font-medium'>Direct Message</h2>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
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
