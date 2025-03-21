import React from 'react';

interface ToggleProps {
  isActive?: boolean;
  onChange?: () => void;
  children: React.ReactNode;
}

const Toggle: React.FC<ToggleProps> = ({
  isActive = false,
  onChange,
  children,
}) => {
  return (
    <button
      className={`p-1 h-8 w-8 rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-neutral-100'
          : 'bg-transparent text-neutral-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-600'
      }`}
      onClick={onChange}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

Toggle.displayName = 'Toggle';

export default Toggle;
