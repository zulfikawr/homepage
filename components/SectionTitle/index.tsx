import Link from 'next/link';
import { Icon } from '@/components/UI';
import { useEffectToggle } from '@/contexts/effectContext';
import { useRadius } from '@/contexts/radiusContext';
import type { IconName } from '@/components/UI/Icon';

interface SectionTitleProps {
  icon: IconName;
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
  const { effectEnabled } = useEffectToggle();
  const { radius } = useRadius();

  return (
    <div
      className={`flex items-center relative z-10 mb-5 ${link ? 'justify-between' : 'justify-start'}`}
    >
      <div
        className={`inline-flex items-center border shadow-md px-4 py-[4px] font-medium tracking-wider ${
          effectEnabled
            ? 'border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md'
            : 'border-border bg-card'
        }`}
        style={{ borderRadius: `${radius}px` }}
      >
        <span className={`mr-1.5 flex h-5 w-5 ${iconClassName}`}>
          <Icon name={icon} />
        </span>
        <span className='block uppercase'>{title}</span>
      </div>
      {link && (
        <Link
          href={link.href}
          target='_blank'
          className='flex items-center gap-x-2 text-muted-foreground hover:text-muted-foreground dark:hover:text-neutral-300'
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
