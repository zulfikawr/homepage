import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

type ButtonTypes =
  | 'default'
  | 'primary'
  | 'menu-default'
  | 'menu-primary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

interface Props {
  type?: ButtonTypes;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}

type NativeAttrs = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props
>;

export type ButtonProps = Props & NativeAttrs;

const Button = ({
  type = 'default',
  icon,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const getButtonClasses = () => {
    switch (type) {
      case 'primary':
        return 'py-2 px-5 h-9 shadow-sm border border-blue-500 dark:border-blue-900 dark:bg-blue-900 dark:text-neutral-300 bg-blue-500 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-800 hover:shadow-inner text-white';
      case 'menu-default':
        return 'w-max py-2 px-5 h-9 hover:bg-menu dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400';
      case 'menu-primary':
        return 'w-max py-2 px-5 h-9 hover:bg-pink-100 dark:hover:bg-pink-900 text-pink-500 dark:text-pink-400';
      case 'destructive':
        return 'w-max py-2 px-5 h-9 shadow-sm border border-red-500 dark:border-red-900 dark:bg-red-900 dark:text-neutral-300 bg-red-500 hover:bg-red-600 hover:border-red-600 dark:hover:bg-red-800 dark:hover:border-red-800 hover:shadow-inner text-white';
      case 'outline':
        return 'w-max py-2 px-5 h-9 shadow-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:shadow-inner bg-transparent';
      case 'ghost':
        return 'w-max py-2 px-5 h-9 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-transparent text-neutral-700 dark:text-neutral-300';
      case 'link':
        return 'w-max py-2 px-5 h-9 hover:underline bg-transparent text-blue-500 dark:text-blue-400';
      default:
        return 'w-max py-2 px-5 h-9 shadow-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 hover:shadow-inner bg-white';
    }
  };

  return (
    <button
      type='button'
      className={twMerge(
        'rounded-md cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex',
        getButtonClasses(),
        icon ? 'gap-2' : '',
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className='h-5 w-5 flex-shrink-0'>
          <Icon name={icon} />
        </span>
      )}
      {children}
    </button>
  );
};

Button.displayName = 'Button';

export { Button };
