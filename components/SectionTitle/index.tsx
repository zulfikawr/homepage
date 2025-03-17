import Link from 'next/link';
import { Icon } from '@/components/UI';

interface SectionTitleProps {
  icon: string;
  title: string;
  iconClassName?: string;
  link?: {
    href: string;
    label: string;
  };
}

const SectionTitle = ({
  icon,
  title,
  link,
  iconClassName = '',
}: SectionTitleProps) => {
  return (
    <div
      className={`flex items-center relative z-10 mb-5 ${link ? 'justify-between' : 'justify-start'}`}
    >
      <div className='inline-flex items-center rounded-full border border-neutral-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-neutral-600 dark:bg-neutral-700'>
        <span className={`mr-1.5 flex h-5 w-5 ${iconClassName}`}>
          <Icon name={icon} />
        </span>
        <span className='block uppercase'>{title}</span>
      </div>
      {link && (
        <Link
          href={link.href}
          target='_blank'
          className='flex items-center gap-x-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
        >
          {link.label}
          <span className='h-5 w-5'>
            <Icon name='arrowSquareOut' />
          </span>
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
