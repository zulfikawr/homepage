import { Icon } from 'components/UI';

interface CardEmptyProps {
  message?: string;
}

export default function CardEmpty({
  message = 'You Have Reached The Bottom Line',
}: CardEmptyProps) {
  return (
    <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <p className='flex items-center justify-center px-5 py-8 text-md font-light tracking-wide text-gray-600 dark:text-gray-400'>
        <span className='mr-3 h-6 w-6'>
          <Icon name='empty' />
        </span>
        {message}
      </p>
    </div>
  );
}
