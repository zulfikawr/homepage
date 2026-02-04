import Link from 'next/link';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Card } from '@/components/ui';
import NavigationCard from '@/components/ui/card/variants/navigation';
import { IconName } from '@/components/ui/icon';

interface ContactItem {
  platform: string;
  link: string;
  username: string;
  icon: IconName;
  color: string;
}

const contacts: ContactItem[] = [
  {
    platform: 'Email',
    link: 'mailto:zulfikawr@gmail.com',
    username: 'zulfikawr@gmail.com',
    icon: 'envelope',
    color: 'text-destructive',
  },
  {
    platform: 'GitHub',
    link: 'https://github.com/zulfikawr',
    username: '@zulfikawr',
    icon: 'githubLogo',
    color: 'text-foreground',
  },
  {
    platform: 'LinkedIn',
    link: 'https://linkedin.com/in/zulfikar-muhammad',
    username: 'Muhammad Zulfikar',
    icon: 'linkedinLogo',
    color: 'text-theme-blue',
  },
  {
    platform: 'GitHub',
    link: 'https://github.com/zulfikawr',
    username: 'zulfikawr',
    icon: 'githubLogo',
    color: 'text-theme-green',
  },
];

export default function ContactsContent() {
  return (
    <div>
      <PageTitle
        emoji='📞'
        title='Contacts'
        subtitle="Let's connect! Here are the best ways to reach me."
      />

      <div className='flex flex-col gap-8'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <StaggerContainer>
            {contacts.map((contact, index) => (
              <ViewTransition key={index}>
                <NavigationCard
                  title={contact.platform}
                  desc={contact.username}
                  icon={contact.icon}
                  className={contact.color}
                  href={contact.link}
                />
              </ViewTransition>
            ))}
          </StaggerContainer>
        </div>

        <ViewTransition>
          <Card isPreview className='p-6'>
            <h2 className='mb-2 text-lg font-medium'>Direct Message</h2>
            <p className='text-sm text-muted-foreground dark:text-muted-foreground'>
              Prefer to send a private message? Feel free to use the{' '}
              <Link
                href='/feedback'
                className='text-theme-blue hover:underline dark:text-theme-blue'
              >
                feedback form
              </Link>{' '}
              or reach out through any of the platforms above.
            </p>
          </Card>
        </ViewTransition>
      </div>
    </div>
  );
}
