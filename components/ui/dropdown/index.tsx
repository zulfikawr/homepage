'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Portal } from '@/components/ui';
import { useRadius } from '@/contexts/radius-context';
import { useBodyScroll, useHotkeys } from '@/hooks';

import { Icon, type IconName } from '../icon';

const DropdownContext = createContext<{
  setIsOpen: (open: boolean) => void;
}>({
  setIsOpen: () => {},
});

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  matchTriggerWidth?: boolean;
}

const Dropdown = ({
  trigger,
  children,
  onOpenChange,
  className = '',
  matchTriggerWidth = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedMenuCoords, setCalculatedMenuCoords] = useState({
    top: 0,
    left: undefined,
    right: undefined,
    width: 0,
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

    let newPosition: 'top' | 'bottom' = 'bottom';
    if (spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight) {
      newPosition = 'top';
    } else if (
      spaceBelow < estimatedMenuHeight &&
      spaceAbove < estimatedMenuHeight
    ) {
      newPosition = spaceAbove > spaceBelow ? 'top' : 'bottom';
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
        width: triggerRect.width,
      },
      position: newPosition,
      align: newAlign,
    };
  }, [children]);

  const handleOpen = useCallback(() => {
    isIntentOpenRef.current = true;

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
  }, [calculatePosition, onOpenChange]);

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
      <div className={`relative inline-block ${className}`}>
        <div
          ref={triggerRef}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          role='button'
          className='group inline-flex w-full items-center relative'
          data-dropdown-content='true'
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
              className={`fixed z-[9999] ${
                matchTriggerWidth ? '' : 'w-max'
              } shadow-brutalist-lg border-2 transition-all duration-200 ease-in-out max-h-[70vh] overflow-y-auto ${
                isOpen
                  ? 'opacity-100 scale-y-100'
                  : 'opacity-0 scale-y-95 pointer-events-none'
              }
                ${effectStyles}
              `}
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
              }}
            >
              <div className='p-1 space-y-1'>{children}</div>
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
      className={`w-full text-left px-4 py-2 transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
        isActive ? activeStyles : inactiveStyles
      } ${className}`}
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
