import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Dropdown = ({
  trigger,
  children,
  onOpenChange,
  position = 'bottom',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    },
    [onOpenChange],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

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
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  };

  const getTransitionClass = () => {
    switch (position) {
      case 'top':
        return isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2';
      case 'bottom':
        return isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2';
      case 'left':
        return isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2';
      case 'right':
        return isOpen
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-2';
      default:
        return isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2';
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Trigger Element */}
      <div onClick={toggleDropdown} aria-expanded={isOpen} role='button'>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute ${getPositionClass()} z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg transition-all duration-200 ease-in-out ${getTransitionClass()} ${
          !isOpen ? 'pointer-events-none' : ''
        }`}
        role='menu'
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
