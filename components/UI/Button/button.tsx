import React from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon/icon';
import type { ButtonTypes, IconNames } from '../types';

interface Props {
  type?: ButtonTypes;
  icon?: IconNames;
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}

type NativeAttrs = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props
>;
export type ButtonProps = Props & NativeAttrs;

interface TemplateProps {
  defaultClassName?: string;
  icon?: IconNames;
  className?: string;
  children?: React.ReactNode;
}

const Template = ({
  children,
  className,
  defaultClassName,
  icon,
  ...args
}: TemplateProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type='button'
      className={twMerge(
        defaultClassName,
        `flex items-center effect-pressing ${icon ? 'gap-2' : ''}`,
        className,
      )}
      {...args}
    >
      {icon && (
        <span className='h-5 w-5 flex-shrink-0'>
          <Icon name={icon} />
        </span>
      )}
      <>{children}</>
    </button>
  );
};

const Button = ({
  type = 'default',
  icon,
  className,
  children = '',
  ...rest
}: ButtonProps) => {
  switch (type) {
    case 'menu-default':
      return (
        <Template
          aria-label='menu-default'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 hover:bg-menu dark:hover:bg-gray-800 rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex text-gray-500 dark:text-gray-400'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'primary':
      return (
        <Template
          aria-label='primary'
          className={className}
          defaultClassName='py-2 px-5 h-9 shadow-sm border border-blue-500 dark:border-blue-900 dark:bg-blue-900 dark:text-gray-300 bg-blue-500 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-800 hover:shadow-inner text-white rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'menu-primary':
      return (
        <Template
          aria-label='menu-primary'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex text-pink-500 dark:text-pink-400'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'destructive':
      return (
        <Template
          aria-label='destructive'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 shadow-sm border border-red-500 dark:border-red-900 dark:bg-red-900 dark:text-gray-300 bg-red-500 hover:bg-red-600 hover:border-red-600 dark:hover:bg-red-800 dark:hover:border-red-800 hover:shadow-inner text-white rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'outline':
      return (
        <Template
          aria-label='outline'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 shadow-sm border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-inner rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider bg-transparent flex'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'ghost':
      return (
        <Template
          aria-label='ghost'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider bg-transparent flex text-gray-700 dark:text-gray-300'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    case 'link':
      return (
        <Template
          aria-label='link'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 hover:underline rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider bg-transparent flex text-blue-500 dark:text-blue-400'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
    default:
      return (
        <Template
          aria-label='default'
          className={className}
          defaultClassName='w-max py-2 px-5 h-9 shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 hover:shadow-inner rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider bg-white flex'
          icon={icon}
          {...rest}
        >
          {children}
        </Template>
      );
  }
};

Button.displayName = 'Button';

export default Button;
