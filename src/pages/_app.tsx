import type { NextPage } from 'next';
import { AuthProvider } from '~/contexts/authContext';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { TitleProvider } from '~/contexts/titleContext';
import '~/styles/tailwind.css';
import '~/styles/global.css';
import '~/styles/atom-one-dark.css';
import Drawer from '~/components/Drawer';
import Modal from '~/components/Modal';
import Toast from '~/components/Toast';
import ProgressBar from '~/components/ProgressBar';

export type NextPageWithLayout = NextPage & {
  layout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.layout ?? ((page) => page);

  return (
    <>
      <AuthProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
        >
          <TitleProvider>
            <div className='min-h-screen animate-appear bg-neutral-100 dark:bg-neutral-900 dark:text-white'>
              <>{getLayout(<Component {...pageProps} />)}</>
            </div>
            <ProgressBar />
            <Drawer />
            <Modal />
            <Toast />
          </TitleProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
