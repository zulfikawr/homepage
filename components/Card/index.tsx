import React, { ReactNode } from 'react';

export interface CardProps {
  onClick?: () => void;
  isInDrawer?: boolean;
  isInForm?: boolean;
  className?: string;
  children?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  onClick,
  isInDrawer,
  isInForm,
  className = '',
  children,
}) => {
  return (
    <div
      className={`group relative cursor-pointer flex flex-col ${
        isInDrawer || isInForm ? 'w-full' : ''
      } rounded-md border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-none ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Card };
