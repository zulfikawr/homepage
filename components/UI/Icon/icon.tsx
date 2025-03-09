import React from 'react';
import icons from './icons';
import { IconNames } from '../types';

interface IconProps {
  name: IconNames;
  className?: string;
}

export const Icon = ({ name = 'empty', className }: IconProps) => {
  const IconComponent = icons[name];

  return React.cloneElement(IconComponent, { className });
};

export default Icon;
