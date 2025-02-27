import { propTypes } from '~/utilities/propTypes';
import icons from '../UI/Icon/icons';

export const buttonTypes = propTypes.tuple(
  'default',
  'menu-default',
  'primary',
  'menu-primary',
  'destructive',
);
export const labelTypes = propTypes.tuple(
  'primary',
  'secondary',
  'green',
  'gray-icon',
  'orange-icon',
  'sticky-icon',
  'green-icon',
);
export const iconsNames = propTypes.tuple(...Object.keys(icons));

export type ButtonTypes = (typeof buttonTypes)[number];
export type IconNames = (typeof iconsNames)[number];
export type LabelTypes = (typeof labelTypes)[number];
