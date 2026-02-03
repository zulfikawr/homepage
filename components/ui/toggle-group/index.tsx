'use client';

import { twMerge } from 'tailwind-merge';

import { Icon, Toggle } from '@/components/ui';
import type { IconName } from '@/components/ui/icon';
import { useRadius } from '@/contexts/radius-context';

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

  return (
    <div
      className='inline-flex items-center border-2 border-border shadow-brutalist'
      style={{ borderRadius: `${radius}px` }}
    >
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <Toggle
            key={option.value}
            isActive={value === option.value}
            onChange={() => onChange(option.value)}
            className={twMerge(
              'shadow-none border-0 hover:shadow-none hover:transform-none active:transform-none p-0 h-9',
              !isFirst && 'border-l-2 border-border',
            )}
            style={{
              borderTopLeftRadius: isFirst ? `${Math.max(0, radius - 2)}px` : 0,
              borderBottomLeftRadius: isFirst
                ? `${Math.max(0, radius - 2)}px`
                : 0,
              borderTopRightRadius: isLast ? `${Math.max(0, radius - 2)}px` : 0,
              borderBottomRightRadius: isLast
                ? `${Math.max(0, radius - 2)}px`
                : 0,
            }}
          >
            <div className='flex items-center gap-2 text-sm px-4 py-1.5 cursor-pointer'>
              {option.icon && <Icon name={option.icon} className='size-4.5' />}
              {option.label}
            </div>
          </Toggle>
        );
      })}
    </div>
  );
};
