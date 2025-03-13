import React from 'react';
import { twMerge } from 'tailwind-merge';

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormLabel = ({
  htmlFor,
  required = false,
  children,
  className,
}: FormLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge('block text-md font-medium mb-2', className)}
    >
      {children}
      {required && <span className='text-red-500'> *</span>}
    </label>
  );
};

FormLabel.displayName = 'FormLabel';

export { FormLabel };
