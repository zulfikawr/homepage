import icons from './icons';
import { IconNames } from '../types';

interface IconProps {
  name: IconNames;
  className?: string;
}

export const Icon = ({ name = 'empty' }: IconProps) => {
  return icons[name];
};

export default Icon;
