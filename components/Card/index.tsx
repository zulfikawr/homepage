'use client';

import { useEffectToggle } from '@/contexts/effectContext';
import { useRadius } from '@/contexts/radiusContext';

export interface CardProps {
  onClick?: () => void;
  isInDrawer?: boolean;
  openForm?: boolean;
  isInForm?: boolean;
  isPreview?: boolean;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  onClick,
  isInDrawer,
  openForm,
  isInForm,
  isPreview,
  isActive,
  className = '',
  children,
}) => {
  const { effectEnabled } = useEffectToggle();
  const { radius } = useRadius();

  const baseStyles = `group relative flex flex-col ${
    isInDrawer || openForm || isInForm || isPreview ? 'w-full' : ''
  } border shadow-md select-none ${className}`;

  const effectStyles = effectEnabled
    ? isActive
      ? 'bg-primary/20 dark:bg-primary/30 border-primary/50 dark:border-primary/50 backdrop-blur-md'
      : 'bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 backdrop-blur-md'
    : isActive
      ? 'bg-primary/10 border-primary dark:border-primary'
      : 'bg-card border-border backdrop-blur-none';

  const interactiveStyles =
    isInForm || isPreview
      ? ''
      : `cursor-pointer transition-all duration-300 ${!isActive ? 'hover:-translate-y-0.5 hover:shadow-xl' : ''}`;

  return (
    <div
      className={`${baseStyles} ${effectStyles} ${interactiveStyles}`}
      style={{ borderRadius: `${radius}px` }}
      onClick={isInForm || isPreview ? undefined : onClick}
    >
      {children}
    </div>
  );
};

export { Card };
