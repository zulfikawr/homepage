import type { Metadata } from 'next';
import Providers from './providers';
import Drawer from '@/components/Drawer';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/tailwind.css';
import '@/styles/global.css';
import '@/styles/atom-one-dark.css';
import DynamicBackground from '@/components/Visual/Background';

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
  return (
    <html lang='en-us' suppressHydrationWarning>
      <head>
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
      <body className='relative transition-all duration-300'>
        <Providers>
          {/* Background layer */}
          <DynamicBackground />

          {/* Content layer */}
          <div className='relative z-10 min-h-screen bg-neutral-100/50 dark:bg-neutral-900/50'>
            <Header />
            <main className='w-full lg:w-content mx-auto min-h-main px-4 lg:px-0 pt-0 lg:pt-20'>
              {children}
            </main>
            <Footer />
          </div>

          <Drawer />
          <Modal />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
