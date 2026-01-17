import { Icon } from '@/components/UI';

interface CardEmptyProps {
  message?: string;
}

export default function CardEmpty({
  message = 'You Have Reached The Bottom Line',
}: CardEmptyProps) {
  return (
    <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card'>
      <p className='flex items-center justify-center px-5 py-[2.5rem] text-md font-light tracking-wide text-muted-foreground dark:text-neutral-400'>
        <span className='mr-3 h-6 w-6'>
          <Icon name='ghost' />
        </span>
        {message}
      </p>
    </div>
  );
}
