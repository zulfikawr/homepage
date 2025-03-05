import { OffsetTransition } from '../Motion';
import { Icon } from '~/components/UI';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

const themes = ['system', 'dark', 'light'];
const icons = [
  <Icon key='system' name='desktop' />,
  <Icon key='dark' name='moon' />,
  <Icon key='light' name='sun' />,
];
const targetThemes = ['dark', 'light', 'system'];

export default function Footer() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className='mt-20 border-b border-t border-gray-200 bg-white py-4 text-center dark:border-gray-700 dark:bg-gray-800'>
      {/* Theme Toggle Button */}
      <div className='fixed bottom-8 left-8 text-gray-500 dark:text-gray-300 z-[9998]'>
        <button
          aria-label='change theme'
          onClick={() => {
            setTheme(targetThemes[themes.indexOf(theme)]);
          }}
          className='effect-pressing flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white !p-3 text-xl tracking-wider shadow-sm hover:shadow-inner focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
        >
          <span className='h-7 w-7'>{icons[themes.indexOf(theme)]}</span>
        </button>
      </div>

      {/* Scroll to Top Button */}
      <div className='fixed bottom-8 right-8 text-gray-500 dark:text-gray-300 z-[9999]'>
        <OffsetTransition componentRef={backToTopRef}>
          <button
            ref={backToTopRef}
            aria-label='scroll to top'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className='effect-pressing flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white p-3 text-xl tracking-wider opacity-0 shadow-sm hover:shadow-inner focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
          >
            <span className='h-7 w-7'>
              <Icon name='caretUp' />
            </span>
          </button>
        </OffsetTransition>
      </div>

      {/* Footer Text */}
      <p className='text-4 tracking-wide text-gray-500 dark:text-gray-400'>
        <a
          href='https://creativecommons.org/licenses/by-nc-sa/4.0/'
          target='_blank'
          rel='noreferrer'
        >
          CC BY-NC-SA 4.0
        </a>{' '}
        <span>·</span>{' '}
        <a
          href='https://github.com/zulfikawr/homepage/'
          target='_blank'
          rel='noreferrer'
        >
          Open Source Software (OSS)
        </a>
      </p>
    </footer>
  );
}
