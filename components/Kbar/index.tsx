import { drawer } from '@/components/Drawer';
import { KbarContent } from './components';
import { useHotkeys } from 'react-hotkeys-hook';
import { Input } from '@/components/UI';

export function Kbar() {
  useHotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    drawer.open(<KbarContent />);
  });

  return (
    <div className='effect-pressing hidden lg:flex lg:w-content mx-auto'>
      <div
        aria-label='Command + K to open the command palette'
        className='absolute left-3 top-[7px] z-10 rounded-md border bg-neutral-50 px-1.5 py-0.5 text-xs text-neutral-400 dark:border-neutral-600 dark:bg-transparent'
      >
        ⌘+K
      </div>
      <Input
        className='w-full rounded-md bg-white bg-opacity-90 cursor-pointer px-3 py-2 pl-14 text-sm text-neutral-500 outline-none transition-shadow hover:bg-neutral-50 dark:bg-neutral-800 dark:bg-opacity-50 dark:shadow-sm dark:hover:bg-neutral-800'
        placeholder='Type your command or search...'
        onFocus={() => drawer.open(<KbarContent />)}
      />
    </div>
  );
}
