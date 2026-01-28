import { drawer } from '@/components/Drawer';
import { Input } from '@/components/UI';
import { useHotkeys } from '@/hooks';

import { KbarContent } from './components';

export function Kbar() {
  useHotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    drawer.open(<KbarContent />);
  });

  return (
    <div className='w-content effect-pressing hidden lg:flex select-none'>
      <div
        aria-label='Command + K to open the command palette'
        className='absolute left-3 top-[7px] z-10 rounded-md border border-gruv-orange/30 bg-gruv-orange/10 px-1.5 py-0.5 text-xs text-gruv-orange dark:bg-gruv-orange/20 dark:text-gruv-orange font-bold'
      >
        ⌘+K
      </div>
      <Input
        className='w-full bg-muted/50 dark:bg-card hover:bg-muted dark:hover:bg-muted rounded-md cursor-pointer px-3 py-2 pl-14 text-sm text-muted-foreground outline-none transition-all duration-200 border-primary/10'
        placeholder='Type your command or search...'
        onFocus={() => drawer.open(<KbarContent />)}
      />
    </div>
  );
}
