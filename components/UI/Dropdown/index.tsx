'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Portal } from '@/components/UI';
import { useRadius } from '@/contexts/radiusContext';
import { useBodyScroll, useHotkeys } from '@/hooks';

import { Icon, type IconName } from '../Icon';

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
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [, setBodyScrollable] = useBodyScroll();
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    left?: number;
    right?: number;
    width: number;
  }>({ top: 0, width: 0 });
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [align, setAlign] = useState<'left' | 'right'>('left');
  const isIntentOpenRef = useRef(false);

  const { radius } = useRadius();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const menuHeight = menuRef.current?.offsetHeight || 200;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const newPosition =
      spaceBelow < menuHeight && triggerRect.top > menuHeight
        ? 'top'
        : 'bottom';

    const alignRight = triggerRect.left > viewportWidth / 2;
    const newAlign = alignRight ? 'right' : 'left';

    setPosition(newPosition);
    setAlign(newAlign);
    setMenuCoords({
      top:
        newPosition === 'bottom' ? triggerRect.bottom + 8 : triggerRect.top - 8,
      left: alignRight ? undefined : triggerRect.left,
      right: alignRight ? viewportWidth - triggerRect.right : undefined,
      width: triggerRect.width,
    });
  }, []);

  const handleOpen = useCallback(() => {
    isIntentOpenRef.current = true;
    calculatePosition();
    setShouldRender(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isIntentOpenRef.current) {
          setIsOpen(true);
          setIsVisible(true);
          onOpenChange?.(true);
        }
      });
    });
  }, [calculatePosition, onOpenChange]);

  const handleClose = useCallback(() => {
    isIntentOpenRef.current = false;
    setIsOpen(false);
    setIsVisible(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    setBodyScrollable(!isVisible);
  }, [isVisible, setBodyScrollable]);

  useEffect(() => {
    if (!isOpen && shouldRender) {
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks inside the menu
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      // Ignore clicks on the trigger (let the trigger's onClick handle toggling)
      if (
        triggerRef.current &&
        triggerRef.current.contains(event.target as Node)
      ) {
        return;
      }

      event.stopPropagation();
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
        {/* Trigger Element */}
        <div
          ref={triggerRef}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          role='button'
          className='group inline-flex w-full items-center relative'
        >
          {trigger}
        </div>

        {/* Dropdown Menu Portal */}
        {shouldRender && (
          <Portal>
            {/* Overlay to block hover states and interactions on underlying elements */}
            {isOpen && (
              <div
                className='fixed inset-0 z-[9998] bg-transparent cursor-default'
                aria-hidden='true'
              />
            )}
            <div
              ref={menuRef}
              className={`fixed z-[9999] ${
                matchTriggerWidth ? '' : 'w-max'
              } shadow-brutalist-lg border-2 transition-all duration-200 ease-in-out ${
                isOpen
                  ? 'opacity-100 scale-y-100'
                  : 'opacity-0 scale-y-95 pointer-events-none'
              }
                ${effectStyles}
              `}
              role='menu'
              style={{
                top: menuCoords.top,
                left: menuCoords.left,
                right: menuCoords.right,
                width: matchTriggerWidth ? `${menuCoords.width}px` : 'auto',
                transformOrigin: `${position === 'top' ? 'bottom' : 'top'} ${
                  align === 'right' ? 'right' : 'left'
                }`,
                transform: position === 'top' ? 'translateY(-100%)' : 'none',
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
      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
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
