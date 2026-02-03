'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  delayStep?: number;
  initialDelay?: number;
}

const StaggerContainer = ({
  children,
  delayStep = 0.05,
  initialDelay = 0,
}: Props) => {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // Cap the maximum delay to prevent excessive stagger on long lists
          const maxDelay = 0.3;
          const calculatedDelay = Math.min(
            ((child as React.ReactElement<{ delay?: number }>).props.delay ||
              initialDelay) +
              index * delayStep,
            maxDelay,
          );

          return React.cloneElement(
            child as React.ReactElement<{ delay?: number }>,
            {
              delay: calculatedDelay,
            },
          );
        }
        return child;
      })}
    </>
  );
};

export default StaggerContainer;
