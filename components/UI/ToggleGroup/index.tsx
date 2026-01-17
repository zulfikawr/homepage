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

  return (
    <div
      className='inline-flex items-center overflow-hidden border border-border'
      style={{ borderRadius: `${radius}px` }}
    >
      {options.map((option, index) => {
        const isFirst = index === 0;
        const baseBorder = !isFirst ? 'border-l border-border' : '';

        return (
          <Toggle
            key={option.value}
            isActive={value === option.value}
            onChange={() => onChange(option.value)}
            className={`${baseBorder} p-0 h-9`}
            style={{ borderRadius: 0 }}
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
