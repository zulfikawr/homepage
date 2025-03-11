import PageCard from '@/components/Card/Page';
import PageTitle from '@/components/PageTitle';

export default function PagesContent() {
  const pages = [
    {
      title: 'Contacts',
      desc: 'Get in touch',
      icon: 'addressBook',
      href: '/contacts',
    },
    {
      title: 'Dashboard',
      desc: 'View my stats',
      icon: 'presentationChart',
      href: '/dashboard',
    },
    {
      title: 'Feedback',
      desc: 'Share your thoughts',
      icon: 'chatCenteredText',
      href: '/feedback',
    },
    {
      title: 'Playlist',
      desc: 'My favorite tunes',
      icon: 'musicNotes',
      href: '/playlist',
    },
    {
      title: 'Podcasts',
      desc: 'Recommended listens',
      icon: 'microphone',
      href: '/podcasts',
    },
    {
      title: 'Posts',
      desc: 'Browse my posts',
      icon: 'note',
      href: '/post',
    },
    {
      title: 'Projects',
      desc: 'See my work',
      icon: 'package',
      href: '/projects',
    },
    {
      title: 'Reading List',
      desc: 'Books I love',
      icon: 'bookOpen',
      href: '/reading-list',
    },
    {
      title: 'Resume',
      desc: 'View my CV',
      icon: 'file',
      href: '/documents/resume.pdf',
    },
    {
      title: 'Schedule',
      desc: 'Book a meeting',
      icon: 'calendarPlus',
      href: '/schedule',
    },
    {
      title: 'UI',
      desc: 'Explore UI components',
      icon: 'layout',
      href: '/ui',
    },
  ];

  const colors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'text-teal-500',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500',
    'text-pink-500',
    'text-gray-500',
    'text-violet-500',
  ];

  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Pages'
        subtitle='Explore all pages in this website'
        route='/pages'
      />

      <div className='grid grid-cols-2 gap-4'>
        {pages
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((page, index) => (
            <PageCard
              key={index}
              title={page.title}
              desc={page.desc}
              icon={page.icon}
              className={shuffledColors[index % shuffledColors.length]}
              href={page.href}
            />
          ))}
      </div>
    </div>
  );
}
