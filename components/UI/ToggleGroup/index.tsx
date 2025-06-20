import React from 'react';
import { Toggle, Icon } from '@/components/UI';
import type { IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

interface ToggleOption {
  label: string;
  value: string;
  icon?: IconName;
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
  const { radius } = useRadius();

  const roundedClass = (side: 'l' | 'r') => {
    return `rounded-${side}-[${radius}px]`;
  };

  return (
    <div
      className='inline-flex items-center overflow-hidden border border-neutral-300 dark:border-neutral-600'
      style={{ borderRadius: `${radius}px` }}
    >
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        const baseBorder = !isFirst
          ? 'border-l border-neutral-300 dark:border-neutral-600'
          : '';

        const rounded = isFirst
          ? roundedClass('l')
          : isLast
            ? roundedClass('r')
            : '';

        return (
          <Toggle
            key={option.value}
            isActive={value === option.value}
            onChange={() => onChange(option.value)}
            className={`${baseBorder} ${rounded}`}
          >
            <div className='flex items-center gap-2 text-sm px-2 py-1.5'>
              {option.icon && <Icon name={option.icon} className='size-4.5' />}
              {option.label}
            </div>
          </Toggle>
        );
      })}
    </div>
  );
};
