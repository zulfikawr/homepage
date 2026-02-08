import { Suspense, use } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import { twMerge } from 'tailwind-merge';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Drawer } from '@/components/ui';
import { Modal } from '@/components/ui';
import { Toast } from '@/components/ui';
import DynamicBackground from '@/components/visual/background';
import { getCustomizationSettings } from '@/database/customization';
import { getPersonalInfo } from '@/database/personal-info';

import Providers from './providers';

import '@/styles/tailwind.css';

export const dynamic = 'force-dynamic';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const personalInfo = await getPersonalInfo();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'zulfikar.site';
  const siteUrl = `https://${baseUrl}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${personalInfo.name} - IR Student, Journalist & Web Developer`,
      template: `%s | ${personalInfo.name}`,
    },
    description: `${personalInfo.name} is an International Relations student, journalist, and web developer specializing in Next.js, React, and modern web technologies. Explore projects, blog posts, and professional work.`,
    keywords: [
      'Zulfikar',
      personalInfo.name,
      'web developer',
      'journalist',
      'IR student',
      'International Relations',
      'Next.js developer',
      'React developer',
      'full stack developer',
      'software engineer',
      'portfolio',
      'blog',
      'projects',
    ],
    authors: [{ name: personalInfo.name }],
    creator: personalInfo.name,
    publisher: personalInfo.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: personalInfo.name,
      title: `${personalInfo.name} - IR Student, Journalist & Web Developer`,
      description: `${personalInfo.name} is an International Relations student, journalist, and web developer. Explore my portfolio, blog posts, and professional work.`,
      images: [
        {
          url: `${siteUrl}${personalInfo.avatar_url}`,
          width: 1200,
          height: 630,
          alt: `${personalInfo.name} - Profile Picture`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${personalInfo.name} - IR Student, Journalist & Web Developer`,
      description: `${personalInfo.name} is an International Relations student, journalist, and web developer. Explore my portfolio and blog.`,
      images: [`${siteUrl}${personalInfo.avatar_url}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = use(cookies());
  const customization = use(getCustomizationSettings());
  const theme =
    cookieStore.get('theme')?.value || customization.default_theme || 'system';

  return (
    <html
      lang='en-us'
      suppressHydrationWarning
      className={theme !== 'system' ? theme : ''}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'${customization.default_theme}';var d=document.documentElement;if(t!=='system'){d.classList.add(t);}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){d.classList.add('dark');}}catch(e){}})()`,
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Zulfikar',
              url: `https://${process.env.NEXT_PUBLIC_BASE_URL || 'zulfikar.site'}`,
              image: `https://${process.env.NEXT_PUBLIC_BASE_URL || 'zulfikar.site'}/avatar.jpg`,
              jobTitle: 'Web Developer, Journalist, IR Student',
              description:
                'International Relations student, journalist, and web developer specializing in Next.js, React, and modern web technologies',
              email: 'zulfikawr@gmail.com',
              sameAs: [
                'https://github.com/zulfikawr',
                'https://linkedin.com/in/zulfikar-muhammad',
              ],
              knowsAbout: [
                'Web Development',
                'Next.js',
                'React',
                'TypeScript',
                'Journalism',
                'International Relations',
                'Full Stack Development',
              ],
            }),
          }}
        />
        <link rel='preconnect' href='https://api.iconify.design' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon/favicon-16x16.png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link rel='icon' href='/favicon/favicon.ico' />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/favicon/android-chrome-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='512x512'
          href='/favicon/android-chrome-512x512.png'
        />
      </head>
      <body
        className={twMerge(
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          spaceGrotesk.className,
          'relative bg-background',
        )}
      >
        <Providers
          defaultTheme={customization.default_theme}
          defaultBackground={customization.default_background}
        >
          <Script src='https://js.puter.com/v2/' strategy='afterInteractive' />

          {/* Background layer */}
          <DynamicBackground />

          {/* Content layer */}
          <div className='relative z-20 min-h-dvh flex flex-col'>
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <Suspense fallback={null}>
              <main className='w-full lg:w-content mx-auto flex-1 px-4 lg:px-0 pt-0 lg:pt-20'>
                {children}
              </main>
              <Footer />
            </Suspense>
          </div>

          <Drawer />
          <Modal />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
