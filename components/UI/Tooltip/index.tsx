'use client';

import React, { useState } from 'react';
import { useRadius } from '@/contexts/radiusContext';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = 'top',
  align = 'center',
  children,
}) => {
  const { radius } = useRadius();

  const getPositionStyles = (): React.CSSProperties => {
    const isVertical = position === 'top' || position === 'bottom';

    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: align === 'start' ? '0' : align === 'end' ? 'auto' : '50%',
          right: align === 'end' ? '0' : 'auto',
          transform:
            align === 'center' ? 'translate(-50%, -8px)' : 'translate(0, -8px)',
        };
      case 'bottom':
        return {
          top: '100%',
          left: align === 'start' ? '0' : align === 'end' ? 'auto' : '50%',
          right: align === 'end' ? '0' : 'auto',
          transform:
            align === 'center' ? 'translate(-50%, 8px)' : 'translate(0, 8px)',
        };
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
    <div className='relative inline-flex items-center justify-center group/tooltip'>
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      <div
        className='absolute z-[9999] px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover border border-border shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 translate-y-1'
        style={{
          ...getPositionStyles(),
          borderRadius: `${radius}px`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
