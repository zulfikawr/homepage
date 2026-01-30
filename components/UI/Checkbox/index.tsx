'use client';

import { twMerge } from 'tailwind-merge';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  className,
  disabled = false,
}: CheckboxProps) => {
  return (
    <div className={twMerge('flex items-center space-x-2', className)}>
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className='rounded border text-primary focus:ring-ring cursor-pointer'
      />
      <label
        htmlFor={id}
        className='text-sm text-muted-foreground cursor-pointer'
      >
        {' '}
        {label}
      </label>
    </div>
  );
};

Checkbox.displayName = 'Checkbox';

export { Checkbox };
