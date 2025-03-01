import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

const Dropdown = ({ trigger, children, onOpenChange }: DropdownProps) => {
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

  return (
    <div className='relative' ref={dropdownRef}>
      <div onClick={toggleDropdown}>{trigger}</div>

      {isOpen && (
        <div className='absolute z-10 mt-2 bg-white border rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600'>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
