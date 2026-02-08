'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { Portal } from '@/components/ui';
import Mask from '@/components/visual/mask';
import { useRadius } from '@/contexts/radius-context';
import { useBodyScroll, useHotkeys } from '@/hooks';

const PopoverContext = createContext<{
  setIsOpen: (open: boolean) => void;
}>({
  setIsOpen: () => {},
});

// Global state to track open popovers
let globalPopoverCloser: (() => void) | null = null;

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  preferredPosition?: 'top' | 'bottom';
}

const Popover = ({
  trigger,
  children,
  onOpenChange,
  className = '',
  preferredPosition,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedMenuCoords, setCalculatedMenuCoords] = useState({
    top: 0,
    left: undefined,
    right: undefined,
  });
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [, setAlign] = useState<'left' | 'right'>('left');
  const [, setBodyScrollable] = useBodyScroll();
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isIntentOpenRef = useRef(false);

  const { radius } = useRadius();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const numChildren = React.Children.count(children);
    const estimatedMenuHeight = Math.min(numChildren * 40 + 20, 300);

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    let newPosition: 'top' | 'bottom' = preferredPosition || 'bottom';

    if (!preferredPosition) {
      if (
        spaceBelow < estimatedMenuHeight &&
        spaceAbove > estimatedMenuHeight
      ) {
        newPosition = 'top';
      } else if (
        spaceBelow < estimatedMenuHeight &&
        spaceAbove < estimatedMenuHeight
      ) {
        newPosition = spaceAbove > spaceBelow ? 'top' : 'bottom';
      }
    }

    const isAlignRight = triggerRect.left > viewportWidth / 2;
    const newAlign: 'left' | 'right' = isAlignRight ? 'right' : 'left';

    return {
      coords: {
        top:
          newPosition === 'bottom'
            ? triggerRect.bottom + 8
            : triggerRect.top - 8,
        left: isAlignRight ? undefined : triggerRect.left,
        right: isAlignRight ? viewportWidth - triggerRect.right : undefined,
      },
      position: newPosition,
      align: newAlign,
    };
  }, [children, preferredPosition]);

  const handleClose = useCallback(() => {
    isIntentOpenRef.current = false;
    setIsOpen(false);
    setTimeout(() => {
      if (!isIntentOpenRef.current) {
        setIsVisible(false);
        onOpenChange?.(false);
      }
    }, 200);
  }, [onOpenChange]);

  const handleOpen = useCallback(() => {
    // Close any other open popover
    if (globalPopoverCloser) {
      globalPopoverCloser();
    }

    isIntentOpenRef.current = true;
    globalPopoverCloser = handleClose;

    const result = calculatePosition();
    if (result) {
      setCalculatedMenuCoords(result.coords);
      setPosition(result.position);
      setAlign(result.align);

      setIsVisible(true);
      setIsOpen(false);

      requestAnimationFrame(() => {
        if (isIntentOpenRef.current) {
          setIsOpen(true);
          onOpenChange?.(true);
        }
      });
    }
  }, [calculatePosition, onOpenChange, handleClose]);

  useEffect(() => {
    if (isOpen) {
      const handleRecalculate = () => {
        const result = calculatePosition();
        if (result) {
          setCalculatedMenuCoords(result.coords);
          setPosition(result.position);
          setAlign(result.align);
        }
      };

      window.addEventListener('resize', handleRecalculate);
      window.addEventListener('scroll', handleRecalculate, true);
      return () => {
        window.removeEventListener('resize', handleRecalculate);
        window.removeEventListener('scroll', handleRecalculate, true);
      };
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    setBodyScrollable(!isVisible);
  }, [isVisible, setBodyScrollable]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      if (target.closest('[data-popover-content="true"]')) {
        return;
      }

      handleClose();
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      if (globalPopoverCloser === handleClose) {
        globalPopoverCloser = null;
      }
    };
  }, [handleClose]);

  useHotkeys('esc', handleClose, { enabled: isOpen });

  const togglePopover = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  return (
    <PopoverContext.Provider value={{ setIsOpen: handleClose }}>
      <div className={twMerge('relative inline-block', className)}>
        <div
          ref={triggerRef}
          onClick={togglePopover}
          aria-expanded={isOpen}
          role='button'
          className='group inline-flex w-full items-center relative'
          data-popover-content='true'
        >
          {trigger}
        </div>

        {isVisible && (
          <Portal>
            {isOpen && (
              <div
                className='fixed inset-0 z-[9998] bg-transparent cursor-default'
                aria-hidden='true'
                onClick={handleClose}
              />
            )}
            <div
              ref={menuRef}
              className={twMerge(
                'fixed z-[9999] w-max shadow-brutalist-lg border-2 transition-all duration-200 ease-in-out bg-popover border-border backdrop-blur-none',
                isOpen
                  ? 'opacity-100 scale-y-100'
                  : 'opacity-0 scale-y-95 pointer-events-none',
              )}
              role='menu'
              data-popover-content='true'
              style={{
                top: calculatedMenuCoords.top,
                left: calculatedMenuCoords.left,
                right: calculatedMenuCoords.right,
                transformOrigin:
                  position === 'top' ? 'bottom center' : 'top center',
                transform:
                  position === 'top' ? 'translateY(-100%)' : 'translateY(0)',
                borderRadius: `${radius}px`,
              }}
            >
              <Mask
                direction='vertical'
                className='p-1 space-y-1 scrollbar-hide max-h-[50vh] md:max-h-[70vh]'
              >
                {children}
              </Mask>
            </div>
          </Portal>
        )}
      </div>
    </PopoverContext.Provider>
  );
};

Popover.displayName = 'Popover';

export { Popover };
