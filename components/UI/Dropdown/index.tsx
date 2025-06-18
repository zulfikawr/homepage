'use client';

import { useEffectToggle } from '@/contexts/effectContext';
import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  const { effectEnabled } = useEffectToggle();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState('auto');
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  const calculatePosition = useCallback(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Default to bottom, but switch to top if there's not enough space below
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const newPosition =
      spaceBelow < menuRect.height && triggerRect.top > menuRect.height
        ? 'top'
        : 'bottom';

    setPosition(newPosition);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isOpen, calculatePosition]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    },
    [onOpenChange],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (matchTriggerWidth && triggerRef.current) {
      setTriggerWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [isOpen, matchTriggerWidth]);

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const effectStyles = effectEnabled
    ? 'bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md'
    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 backdrop-blur-none';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
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

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        className={`absolute ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        } left-0 z-[9998] ${
          matchTriggerWidth ? 'w-[var(--trigger-width)]' : 'min-w-fit'
        } rounded-md shadow-lg transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 scale-y-100'
            : 'opacity-0 scale-y-95 pointer-events-none'
        }
          ${effectStyles}
        `}
        role='menu'
        style={
          matchTriggerWidth
            ? ({ '--trigger-width': triggerWidth } as React.CSSProperties)
            : undefined
        }
        onClick={toggleDropdown}
      >
        {children}
      </div>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export { Dropdown };
