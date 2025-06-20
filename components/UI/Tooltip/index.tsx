'use client';

import React, { useState } from 'react';
import { useRadius } from '@/contexts/radiusContext';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = 'top',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { radius } = useRadius();

  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      <div
        className={`absolute ${getPositionClass()} px-3 py-2 text-sm text-neutral-800 bg-white dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-lg whitespace-nowrap transition-all duration-200 ${
          isVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0'
        }`}
        style={{
          pointerEvents: 'none',
          borderRadius: `${radius}px`,
          transform: isVisible
            ? 'translate(-50%, 0)'
            : `translate(-50%, ${position === 'top' ? '10px' : position === 'bottom' ? '-10px' : '0'})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
