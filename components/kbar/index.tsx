import { drawer } from '@/components/ui';
import { Input } from '@/components/ui';
import { useHotkeys } from '@/hooks';

export const openKbar = () => {
  void import('./components').then(({ KbarContent }) => {
    drawer.open(<KbarContent />);
  });
};

export function Kbar() {
  useHotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    openKbar();
  });

  return (
    <div className='w-content effect-pressing hidden lg:flex select-none'>
      <div
        aria-label='Command + K to open the command palette'
        role='button'
        onClick={openKbar}
        className='absolute left-3 top-[7px] z-10 rounded-md border bg-primary/20 px-1.5 py-0.5 text-xs text-foreground dark:bg-primary/30 dark:text-foreground font-bold cursor-pointer hover:bg-primary/20'
      >
        ⌘+K
      </div>
      <Input
        className='w-full bg-muted/50 dark:bg-card hover:bg-muted dark:hover:bg-muted rounded-md cursor-pointer px-3 py-2 pl-14 text-sm text-muted-foreground outline-none transition-all duration-200'
        placeholder='Type your command or search...'
        onFocus={openKbar}
      />
    </div>
  );
}
