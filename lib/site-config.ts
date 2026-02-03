export const siteConfig = {
  name: 'Zulfikar',
  title: 'IR Student, Journalist, and Web Developer',
  description: 'Personal website and portfolio of Zulfikar',
  author: 'Zulfikar',
  url:
    process.env.NODE_ENV === 'development'
      ? `https://${process.env.NEXT_PUBLIC_DEV_URL || 'dev.zulfikar.site'}`
      : `https://${process.env.NEXT_PUBLIC_BASE_URL || 'zulfikar.site'}`,
  contacts: [
    {
      platform: 'Email',
      value: 'zulfikawr@gmail.com',
      link: 'mailto:zulfikawr@gmail.com',
    },
    {
      platform: 'GitHub',
      value: '@zulfikawr',
      link: 'https://github.com/zulfikawr',
    },
    {
      platform: 'LinkedIn',
      value: 'Muhammad Zulfikar',
      link: 'https://linkedin.com/in/zulfikar-muhammad',
    },
    {
      platform: 'WhatsApp',
      value: '+6285156453730',
      link: 'https://wa.me/6285156453730',
    },
  ],
  routes: [
    {
      path: '/',
      name: 'Home',
      description:
        'The landing page featuring personal info, technical banners (GitHub, Spotify, Weather), and latest highlights.',
    },
    {
      path: '/analytics',
      name: 'Analytics',
      description:
        'Public analytics dashboard showing page views, visitor geography, and traffic trends.',
    },
    {
      path: '/certs',
      name: 'Certifications',
      description:
        'A gallery of professional certifications and licenses earned by Zulfikar.',
    },
    {
      path: '/contacts',
      name: 'Contacts',
      description:
        'Ways to reach out to Zulfikar, including email and social media platforms.',
    },
    {
      path: '/feedback',
      name: 'Feedback',
      description:
        'An interactive form where visitors can leave messages, suggestions, or feedback.',
    },
    {
      path: '/movies',
      name: 'Movies',
      description:
        'A curated list of movies Zulfikar has watched, complete with ratings and release dates.',
    },
    {
      path: '/music',
      name: 'Music Stats',
      description:
        'Live Spotify statistics including recently played tracks, top artists, and curated playlists.',
    },
    {
      path: '/posts',
      name: 'Blog Posts',
      description:
        'Articles and thoughts on technical topics, international relations, and creative writing.',
    },
    {
      path: '/projects',
      name: 'Projects',
      description:
        'A portfolio of development work, featuring web apps, CLI tools, and more.',
    },
    {
      path: '/publications',
      name: 'Publications',
      description:
        'Academic and journalistic publications written by Zulfikar.',
    },
    {
      path: '/reading-list',
      name: 'Reading List',
      description:
        'Books and literature recommended or currently being read by Zulfikar.',
    },
    {
      path: '/ui',
      name: 'UI Components',
      description:
        'A showcase of the custom UI components built for this website.',
    },
  ],
  techStack: [
    {
      name: 'Next.js 16',
      description: 'Framework with App Router and Turbopack',
    },
    { name: 'React 19', description: 'Frontend library' },
    { name: 'Tailwind CSS 4', description: 'Utility-first CSS framework' },
    {
      name: 'Cloudflare D1 & R2',
      description: 'SQL database and object storage',
    },
    { name: 'Puter.js', description: 'AI capabilities provider' },
    { name: 'Bun', description: 'JavaScript runtime and package manager' },
  ],
  dataSchema: {
    Project: {
      status: ['in_progress', 'completed', 'upcoming'],
      fields: [
        'id',
        'name',
        'date_string',
        'description',
        'tools',
        'status',
        'pinned',
        'slug',
        'github_repo_url',
      ],
    },
    Post: {
      fields: [
        'id',
        'title',
        'excerpt',
        'categories',
        'date_string',
        'content',
        'slug',
      ],
    },
    Book: {
      type: ['currently_reading', 'read', 'to_read'],
      fields: ['title', 'author', 'type', 'date_added', 'link'],
    },
    Employment: {
      job_type: [
        'full_time',
        'part_time',
        'contract',
        'freelance',
        'internship',
      ],
      fields: [
        'organization',
        'job_title',
        'job_type',
        'responsibilities',
        'date_string',
        'organization_location',
      ],
    },
    Certificate: {
      fields: ['title', 'issued_by', 'date_issued', 'credential_id', 'link'],
    },
    Publication: {
      fields: [
        'title',
        'authors',
        'publisher',
        'excerpt',
        'keywords',
        'open_access',
        'link',
      ],
    },
    AnalyticsEvent: {
      fields: [
        'path',
        'country',
        'referrer',
        'user_agent',
        'is_bot',
        'created',
      ],
    },
  },
};
