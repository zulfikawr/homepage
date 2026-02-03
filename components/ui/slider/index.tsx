'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';

interface SliderProps {
  id: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Slider = ({
  id,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  className,
  disabled = false,
}: SliderProps) => {
  const { radius } = useRadius();

  return (
    <div className={twMerge('flex flex-col space-y-1', className)}>
      {label && (
        <label htmlFor={id} className='text-sm text-muted-foreground'>
          {label}
        </label>
      )}
      <input
        id={id}
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className='slider-thumb w-full cursor-pointer appearance-none bg-transparent h-4'
        style={{ '--radius': `${radius}px` } as React.CSSProperties}
      />
    </div>
  );
};

export { Slider };
