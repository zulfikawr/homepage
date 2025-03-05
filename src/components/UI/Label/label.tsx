import React from 'react';
import Icon from '../Icon/icon';
import type { LabelTypes, IconNames } from '../types';

interface Props {
  type: LabelTypes;
  icon?: IconNames;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  keyof Props
>;

type LabelProps = Props & NativeAttrs;

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
          className='cursor-pointer justify-center font-medium items-center flex w-auto lg:px-4 lg:py-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-center rounded-md text-4 text-blue-500 dark:text-blue-300 align-middle effect-pressing'
        >
          {icon && (
            <span className='mr-2 size-5'>
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
          className='cursor-pointer focus:animate-pulse justify-center font-medium items-center flex w-auto lg:px-4 px-2 py-1 lg:py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-center rounded-md text-4 tracking-wide text-gray-500 dark:text-gray-300 align-middle effect-pressing'
        >
          {icon && (
            <span className='mr-2 size-5'>
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
