'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Portal } from '@/components/ui';
import { useRadius } from '@/contexts/radius-context';

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
  const { radius } = useRadius();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }

      setCoords({ top, left });
    }
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isVisible, updateCoords]);

  useEffect(() => {
    if (!isVisible && shouldRender) {
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, shouldRender]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    updateCoords();
    setShouldRender(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isHoveredRef.current) {
          setIsVisible(true);
        }
      });
    });
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(false);
    setShouldRender(false);
  };

  const getTransform = () => {
    const baseTransform = (() => {
      switch (position) {
        case 'top':
          return 'translate(-50%, -100%)';
        case 'bottom':
          return 'translate(-50%, 0)';
        case 'left':
          return 'translate(-100%, -50%)';
        case 'right':
          return 'translate(0, -50%)';
        default:
          return 'translate(-50%, -100%)';
      }
    })();

    const offset = isVisible ? 'translateY(0)' : 'translateY(4px)';
    return `${baseTransform} ${offset}`;
  };

  return (
    <div
      ref={triggerRef}
      className='relative inline-flex items-center justify-center'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip Portal */}
      {shouldRender && (
        <Portal>
          <div
            className='fixed z-[10000] px-3 py-1.5 text-xs font-medium text-popover-foreground bg-popover whitespace-nowrap pointer-events-none transition-all duration-200 ease-out shadow-brutalist'
            style={{
              top: coords.top,
              left: coords.left,
              transform: getTransform(),
              borderRadius: `${radius}px`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            {text}
          </div>
        </Portal>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
