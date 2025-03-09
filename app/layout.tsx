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

export const metadata: Metadata = {
  title: 'Zulfikar',
  description: 'Zulfikar',
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
      </head>
      <body>
        <Providers>
          <div className='min-h-screen bg-neutral-100 dark:bg-neutral-900'>
            <Header />
            <main className='w-full md:w-content mx-auto min-h-main px-5 pt-0 lg:pt-20'>
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
