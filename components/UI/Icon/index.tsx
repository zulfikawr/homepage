import React from 'react';
import { twMerge } from 'tailwind-merge';
import icons from './icons';

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  const Element = icons[name];

  if (!Element) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  return React.cloneElement(Element, {
    className: twMerge(Element.props.className, className),
  });
};

Icon.displayName = 'Icon';

export { Icon };
