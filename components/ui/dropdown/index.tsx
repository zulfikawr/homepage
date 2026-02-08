'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { Portal } from '@/components/ui';
import { Icon, type IconName } from '@/components/ui/icon';
import Mask from '@/components/visual/mask';
import { useRadius } from '@/contexts/radius-context';
import { useHotkeys } from '@/hooks';

const DropdownContext = createContext<{
  setIsOpen: (open: boolean) => void;
}>({
  setIsOpen: () => {},
});

// Global state to track open dropdowns
let globalDropdownCloser: (() => void) | null = null;

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  matchTriggerWidth?: boolean;
  preferredPosition?: 'top' | 'bottom';
}

const Dropdown = ({
  trigger,
  children,
  onOpenChange,
  className = '',
  matchTriggerWidth = false,
  preferredPosition,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedMenuCoords, setCalculatedMenuCoords] = useState({
    top: 0,
    left: undefined,
    right: undefined,
    width: 0,
    maxHeight: 0,
  });
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [, setAlign] = useState<'left' | 'right'>('left');
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isIntentOpenRef = useRef(false);

  const { radius } = useRadius();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    const padding = 24; // 8px gap + 16px safety margin for better spacing
    const maxHeightAbove = spaceAbove - padding;
    const maxHeightBelow = spaceBelow - padding;

    let newPosition: 'top' | 'bottom' = preferredPosition || 'bottom';

    if (!preferredPosition) {
      newPosition = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    }

    const maxHeight =
      newPosition === 'bottom' ? maxHeightBelow : maxHeightAbove;

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
        width: triggerRect.width,
        maxHeight: Math.max(200, maxHeight), // Minimum 200px
      },
      position: newPosition,
      align: newAlign,
    };
  }, [preferredPosition]);

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
    // Close any other open dropdown
    if (globalDropdownCloser) {
      globalDropdownCloser();
    }

    isIntentOpenRef.current = true;
    globalDropdownCloser = handleClose;

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
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      if (target.closest('[data-dropdown-content="true"]')) {
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
      if (globalDropdownCloser === handleClose) {
        globalDropdownCloser = null;
      }
    };
  }, [handleClose]);

  useHotkeys('esc', handleClose, { enabled: isOpen });

  const toggleDropdown = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const effectStyles = 'bg-popover border border-border backdrop-blur-none';

  return (
    <DropdownContext.Provider value={{ setIsOpen: handleClose }}>
      <div className={twMerge('relative inline-block', className)}>
        <div
          ref={triggerRef}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          role='button'
          className='group inline-flex w-full items-center relative'
          data-dropdown-content='true'
        >
          {React.isValidElement(trigger) &&
            React.cloneElement(
              trigger as React.ReactElement<{ children?: React.ReactNode }>,
              {
                children: (
                  <div className='flex items-center justify-between w-full gap-6'>
                    {
                      (
                        trigger as React.ReactElement<{
                          children?: React.ReactNode;
                        }>
                      ).props.children
                    }
                    <Icon
                      name='caretDown'
                      className={twMerge(
                        'size-4 transition-transform duration-200 flex-shrink-0',
                        isOpen ? 'rotate-180' : '',
                      )}
                    />
                  </div>
                ),
              },
            )}
        </div>

        {isVisible && (
          <Portal>
            {isOpen && (
              <div
                className='fixed inset-0 z-[9998] bg-transparent'
                aria-hidden='true'
                onClick={handleClose}
              />
            )}
            <div
              ref={menuRef}
              className={twMerge(
                'fixed z-[9999] shadow-brutalist-lg border-2 transition-all duration-200 ease-in-out',
                matchTriggerWidth ? '' : 'w-max',
                isOpen
                  ? 'opacity-100 scale-y-100'
                  : 'opacity-0 scale-y-95 pointer-events-none',
                effectStyles,
              )}
              role='menu'
              data-dropdown-content='true'
              style={{
                top: calculatedMenuCoords.top,
                left: calculatedMenuCoords.left,
                right: calculatedMenuCoords.right,
                width: matchTriggerWidth
                  ? `${calculatedMenuCoords.width}px`
                  : 'auto',
                transformOrigin:
                  position === 'top' ? 'bottom center' : 'top center',
                transform:
                  position === 'top' ? 'translateY(-100%)' : 'translateY(0)',
                borderRadius: `${radius}px`,
                height: `${calculatedMenuCoords.maxHeight}px`,
              }}
            >
              <Mask direction='vertical' className='scrollbar-hide'>
                <div className='flex flex-col p-1 gap-1'>{children}</div>
              </Mask>
            </div>
          </Portal>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  icon?: IconName | string;
}

const DropdownItem = ({
  children,
  onClick,
  className = '',
  isActive = false,
  icon,
}: DropdownItemProps) => {
  const { setIsOpen } = useContext(DropdownContext);
  const { radius } = useRadius();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();

    requestAnimationFrame(() => {
      setIsOpen(false);
    });
  };

  const activeStyles = 'bg-accent text-accent-foreground';
  const inactiveStyles = 'hover:bg-accent hover:text-accent-foreground';

  return (
    <button
      type='button'
      onClick={handleClick}
      className={twMerge(
        'w-full text-left text-sm md:text-md px-4 py-2 transition-colors duration-150 flex items-center gap-2 cursor-pointer',
        isActive ? activeStyles : inactiveStyles,
        className,
      )}
      style={{ borderRadius: `${radius}px` }}
    >
      {icon && (
        <Icon name={icon as IconName} className='size-4.5 flex-shrink-0' />
      )}
      {children}
    </button>
  );
};

Dropdown.displayName = 'Dropdown';
DropdownItem.displayName = 'DropdownItem';

export { Dropdown, DropdownItem };
