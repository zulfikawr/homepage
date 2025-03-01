import { propTypes } from '~/utilities/propTypes';
import icons from './Icon/icons';

export const buttonTypes = propTypes.tuple(
  'default',
  'menu-default',
  'primary',
  'menu-primary',
  'destructive',
);
export const labelTypes = propTypes.tuple('primary', 'secondary');
export const iconsNames = propTypes.tuple(...Object.keys(icons));

export type ButtonTypes = (typeof buttonTypes)[number];
export type IconNames = (typeof iconsNames)[number];
export type LabelTypes = (typeof labelTypes)[number];
