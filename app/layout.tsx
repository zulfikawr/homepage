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
import Script from 'next/script';

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
        <script
          defer
          src='https://cloud.umami.is/script.js'
          data-website-id='438f9662-37d9-47e8-ba04-c58c1c2d30f2'
        />
        {/* Define isSpace function globally to fix markdown-it issues with Next.js + Turbopack */}
        <Script id='markdown-it-fix' strategy='beforeInteractive'>
          {`
            if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
              };
            }
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <div className='min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-all duration-300'>
            <div className='fixed inset-0 overflow-hidden pointer-events-none background' />
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
