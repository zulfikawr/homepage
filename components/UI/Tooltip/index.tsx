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

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translate(-50%, -8px)',
        };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translate(-50%, 8px)' };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translate(-8px, -50%)',
        };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translate(8px, -50%)' };
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translate(-50%, -8px)',
        };
    }
  };

  return (
    <div
      className='relative inline-flex items-center justify-center'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          className='absolute z-50 px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover border border-border shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200'
          style={{
            ...getPositionStyles(),
            borderRadius: `${radius}px`,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
