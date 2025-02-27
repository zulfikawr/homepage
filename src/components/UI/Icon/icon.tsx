import icons from './icons';
import { IconNames } from '../../Helpers/propTypes';

export interface IconProps {
  /**
   * Specify the name of the icon
   */
  name: IconNames;
  className?: string;
}

export const Icon = ({ name = 'empty' }: IconProps) => {
  return icons[name];
};

export default Icon;
