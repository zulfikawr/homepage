import type { Metadata } from 'next';
import Script from 'next/script';
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
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <Script
          defer
          src='https://cloud.umami.is/script.js'
          data-website-id='438f9662-37d9-47e8-ba04-c58c1c2d30f2'
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
