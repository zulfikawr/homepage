import React from 'react';
import icons from './icons';

type IconNames = string;

interface IconProps {
  name: IconNames;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  const IconComponent = icons[name as keyof typeof icons];

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  return React.cloneElement(IconComponent, { className });
};

Icon.displayName = 'Icon';

export { Icon };
