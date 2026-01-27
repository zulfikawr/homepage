import { Icon } from '@/components/UI';

interface CardEmptyProps {
  message?: string;
  className?: string;
}

export default function CardEmpty({
  message = 'You Have Reached The Bottom Line',
  className,
}: CardEmptyProps) {
  return (
    <div
      className={`w-full rounded-md border bg-card text-center shadow-sm dark:border-border dark:bg-card flex items-center justify-center min-h-[100px] ${className || ''}`}
    >
      <span className='flex items-center text-md font-light tracking-wide text-muted-foreground dark:text-muted-foreground'>
        <span className='mr-3 h-6 w-6'>
          <Icon name='ghost' />
        </span>
        {message}
      </span>
    </div>
  );
}
