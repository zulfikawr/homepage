import React from 'react';
import { Icon, IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

type LabelTypes = 'primary' | 'secondary';

interface Props {
  type: LabelTypes;
  icon?: IconName;
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
  const { radius } = useRadius();

  switch (type) {
    case 'primary':
      return (
        <label
          {...props}
          className='cursor-pointer justify-center font-medium items-center flex w-auto lg:px-4 lg:py-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-center text-sm text-blue-500 dark:text-blue-300 align-middle effect-pressing'
          style={{ borderRadius: `${radius}px` }}
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
          className='cursor-pointer focus:animate-pulse justify-center font-medium items-center flex w-auto lg:px-4 px-2 py-1 lg:py-1 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-center text-sm tracking-wide text-neutral-500 dark:text-neutral-300 align-middle effect-pressing'
          style={{ borderRadius: `${radius}px` }}
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

export { Label };
