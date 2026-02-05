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
import { getCustomizationSettings } from '@/database/customization';

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
        <Providers
          defaultTheme={customization.default_theme}
          defaultBackground={customization.default_background}
        >
          <Script src='https://js.puter.com/v2/' strategy='afterInteractive' />

          {/* Base background color layer */}
          <div className='fixed inset-0 bg-background -z-20' />

          {/* Background layer */}
          <DynamicBackground />

          {/* Content layer */}
          <div className='relative z-20 min-h-screen flex flex-col'>
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
