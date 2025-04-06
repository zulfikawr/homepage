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
  const baseStyles = `group relative flex flex-col ${
    isInDrawer || isInForm ? 'w-full' : ''
  } rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 ${className}`;

  const interactiveStyles = isInForm
    ? ''
    : 'cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-neutral-200 dark:hover:border-neutral-600 dark:hover:shadow-none';

  return (
    <div
      className={`${baseStyles} ${interactiveStyles}`}
      onClick={isInForm ? undefined : onClick}
    >
      {children}
    </div>
  );
};

export { Card };
