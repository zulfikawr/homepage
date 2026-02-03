import { Suspense, use } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Drawer } from '@/components/ui';
import { Modal } from '@/components/ui';
import { Toast } from '@/components/ui';
import DynamicBackground from '@/components/visual/background';

import Providers from './providers';

import '@/styles/tailwind.css';
import '@/styles/atom-one-dark.css';

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

export const metadata: Metadata = {
  title: 'Zulfikar',
  description: 'IR Student, Journalist, and Web Developer',
  keywords: 'Zulfikar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = use(cookies());
  const theme = cookieStore.get('theme')?.value;
  const isDark = theme === 'dark';

  return (
    <html
      lang='en-us'
      suppressHydrationWarning
      className={isDark ? 'dark' : ''}
      style={
        isDark
          ? { colorScheme: 'dark', background: '#282828' }
          : { colorScheme: 'light', background: '#fff9e1' }
      }
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;var isDark=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(isDark){d.classList.add('dark');d.style.colorScheme='dark';d.style.background='#282828';}else{d.classList.remove('dark');d.style.colorScheme='light';d.style.background='#fff9e1';}}catch(e){}})()",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${spaceGrotesk.className} relative`}
      >
        <Providers>
          <Script src='https://js.puter.com/v2/' strategy='afterInteractive' />
          {/* Background layer */}
          <DynamicBackground />

          {/* Content layer */}
          <div className='relative z-20 min-h-screen bg-background/50 flex flex-col'>
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
