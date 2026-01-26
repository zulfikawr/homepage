'use client';

import ScrollWrapper from './scroll';
import React, { useRef } from 'react';

interface Props {
  children: React.ReactNode;
}

const ReverseOffsetTransition = (props: Props) => {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);

  const handler = (position: number) => {
    if (!ref?.current) return;

    // Transition from 0 to 50
    const ratio = Math.max(0, (50 - position) / 50);
    // Use negative translateY to move UP when scrolling down
    ref.current.style.transform = `translateY(${(1 - ratio) * -50 || 0}%)`;
    ref.current.style.opacity = `${ratio}`;

    // Completely hide when ratio is 0 to allow pointer events on the title
    ref.current.style.visibility = ratio === 0 ? 'hidden' : 'visible';
    ref.current.style.pointerEvents = ratio < 0.5 ? 'none' : 'auto';
  };

  return (
    <ScrollWrapper handler={handler} startPosition={0} endPosition={50}>
      <div ref={ref} className='w-full flex justify-center'>
        {children}
      </div>
    </ScrollWrapper>
  );
};

export default ReverseOffsetTransition;
