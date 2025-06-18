import React from 'react';
import { Toggle, Icon } from '@/components/UI';

interface ToggleOption {
  label: string;
  value: string;
  icon?: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className='inline-flex items-center overflow-hidden border border-neutral-300 dark:border-neutral-600 rounded-md'>
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        const roundedClass = isFirst
          ? 'rounded-l-md border-r border-neutral-300 dark:border-neutral-600'
          : isLast
            ? 'rounded-r-md border-l border-neutral-300 dark:border-neutral-600'
            : '';

        return (
          <Toggle
            key={option.value}
            isActive={value === option.value}
            onChange={() => onChange(option.value)}
            className={roundedClass}
          >
            <div className='flex items-center gap-2 text-sm px-2'>
              {option.icon && <Icon name={option.icon} className='w-4 h-4' />}
              {option.label}
            </div>
          </Toggle>
        );
      })}
    </div>
  );
};
