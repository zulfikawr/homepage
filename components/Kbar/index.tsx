import { drawer } from 'components/Drawer';
import { KbarContent } from './components';
import { useHotkeys } from 'react-hotkeys-hook';

export function Kbar() {
  useHotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    drawer.open(<KbarContent />);
  });

  return (
    <div className='effect-pressing hidden lg:flex lg:w-content mx-auto'>
      <div
        aria-label='Command + K to open the command palette'
        className='absolute left-3 top-[6px] z-10 rounded-md border bg-gray-50 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-600 dark:bg-transparent'
      >
        ⌘+K
      </div>
      <input
        className='w-full rounded-md border border-gray-200 bg-white bg-opacity-90 cursor-pointer px-3 py-2 pl-14 text-sm text-gray-500 outline-none transition-shadow hover:bg-neutral-50 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-50 dark:shadow-sm dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:bg-opacity-100'
        placeholder='Type your command or search...'
        onFocus={() => drawer.open(<KbarContent />)}
      />
    </div>
  );
}
