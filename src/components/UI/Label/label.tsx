import React from 'react';
import Icon from '../Icon/icon';
import type { LabelTypes, IconNames } from '../types';

interface Props {
  /**
   * Specify the type of the label
   */
  type: LabelTypes;
  /**
   * Specify the name of the icon to be used
   */
  icon?: IconNames;
  /**
   * The content inside the button
   */
  children?: React.ReactNode;
}

type NativeAttrs = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  keyof Props
>;
export type LabelProps = Props & NativeAttrs;

const Label = ({
  type = 'primary',
  icon,
  children = 'Label',
  ...props
}: LabelProps) => {
  switch (type) {
    case 'primary':
      return (
        <label
          {...props}
          className='cursor-pointer justify-center font-medium items-center flex w-auto lg:px-4 lg:py-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-center rounded-md text-4 lg:text-xl text-blue-500 dark:text-blue-300 align-middle effect-pressing'
        >
          {icon && (
            <span className='lg:w-7 lg:h-7 h-4 w-4 lg:mr-2 mr-1'>
              <Icon name={icon} />
            </span>
          )}
          <>{children}</>
        </label>
      );
    case 'secondary':
      return (
        <label
          {...props}
          className='cursor-pointer focus:animate-pulse justify-center font-medium items-center flex w-auto lg:px-4 px-2 py-1 lg:py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-center rounded-md text-4 lg:text-xl tracking-wide text-gray-500 dark:text-gray-300 align-middle effect-pressing'
        >
          {icon && (
            <span className='lg:w-7 lg:h-7 h-4 w-4 lg:mr-2 mr-1'>
              <Icon name={icon} />
            </span>
          )}
          <>{children}</>
        </label>
      );
  }
};

Label.displayName = 'Label';

export default Label;
