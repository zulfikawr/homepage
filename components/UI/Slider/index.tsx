'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

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
        <label
          htmlFor={id}
          className='text-sm text-neutral-600 dark:text-neutral-400'
        >
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
      <style jsx global>{`
        input[type='range'].slider-thumb {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }

        input[type='range'].slider-thumb:focus {
          outline: none;
          box-shadow: none;
        }

        input[type='range'].slider-thumb::-webkit-slider-runnable-track {
          height: 0.5rem;
          background-color: #d1d5db;
          border-radius: var(--radius);
        }

        .dark input[type='range'].slider-thumb::-webkit-slider-runnable-track {
          background-color: #525252;
        }

        input[type='range'].slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 1rem;
          width: 1rem;
          margin-top: -0.25rem;
          background-color: #fff;
          border: 2px solid #3b82f6;
          border-radius: var(--radius);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
          transition: background-color 0.2s ease;
        }

        .dark input[type='range'].slider-thumb::-webkit-slider-thumb {
          border: none;
        }

        input[type='range'].slider-thumb:disabled::-webkit-slider-thumb {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }

        input[type='range'].slider-thumb::-moz-range-track {
          height: 0.5rem;
          background-color: #d1d5db;
          border-radius: var(--radius);
        }

        .dark input[type='range'].slider-thumb::-moz-range-track {
          background-color: #525252;
        }

        input[type='range'].slider-thumb::-moz-range-thumb {
          height: 1rem;
          width: 1rem;
          background-color: #fff;
          border: 2px solid #3b82f6;
          border-radius: var(--radius);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        input[type='range'].slider-thumb:disabled::-moz-range-thumb {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export { Slider };
