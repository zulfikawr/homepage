'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  delayStep?: number;
  initialDelay?: number;
}

const StaggerContainer = ({
  children,
  delayStep = 0.1,
  initialDelay = 0,
}: Props) => {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{ delay?: number }>,
            {
              delay:
                ((child as React.ReactElement<{ delay?: number }>).props
                  .delay || initialDelay) +
                index * delayStep,
            },
          );
        }
        return child;
      })}
    </>
  );
};

export default StaggerContainer;
