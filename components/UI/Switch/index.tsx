'use client';

import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  disabled?: boolean;
}

const Switch = ({
  id,
  checked,
  onChange,
  label,
  className,
  disabled = false,
}: SwitchProps) => {
  const { radius } = useRadius();

  return (
    <div className={twMerge('flex items-center space-x-2', className)}>
      <button
        id={id}
        role='switch'
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={twMerge(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border-2 border-transparent transition-colors duration-200 ease-in-out overflow-hidden',
          checked ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        style={{ borderRadius: `${radius}px` }}
      >
        <span
          aria-hidden='true'
          className={twMerge(
            'absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-[1rem]' : 'translate-x-0',
          )}
          style={{ borderRadius: `${radius}px` }}
        />
      </button>
      <label
        htmlFor={id}
        className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer select-none'
      >
        {label}
      </label>
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch };
