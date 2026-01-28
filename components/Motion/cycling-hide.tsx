'use client';

import React, { useEffect, useRef } from 'react';

import { useScrollDirection } from '@/hooks/useScrollDirection';

interface Props {
  children: React.ReactNode;
}

const CyclingHideTransition = (props: Props) => {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    if (!ref?.current) return;

    if (scrollDirection === 'down') {
      ref.current.style.transform = `translateY(-50%)`;
      ref.current.style.opacity = '0';
      ref.current.style.visibility = 'hidden';
      ref.current.style.pointerEvents = 'none';
    } else {
      ref.current.style.transform = `translateY(0%)`;
      ref.current.style.opacity = '1';
      ref.current.style.visibility = 'visible';
      ref.current.style.pointerEvents = 'auto';
    }

    // Add transition for smoothness
    ref.current.style.transition = 'all 300ms ease-in-out';
  }, [scrollDirection]);

  return (
    <div ref={ref} className='w-full flex justify-center'>
      {children}
    </div>
  );
};

export default CyclingHideTransition;
