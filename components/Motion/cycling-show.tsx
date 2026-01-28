'use client';

import React, { useEffect } from 'react';

import { useScrollDirection } from '@/hooks/useScrollDirection';

interface Props {
  componentRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  disabled?: boolean;
}

const CyclingShowTransition = (props: Props) => {
  const { componentRef: ref, children } = props;
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    if (!ref?.current || props.disabled) return;

    if (scrollDirection === 'down') {
      ref.current.style.transform = `translateY(0%)`;
      ref.current.style.opacity = '1';
      ref.current.style.visibility = 'visible';
      ref.current.style.pointerEvents = 'auto';
    } else {
      ref.current.style.transform = `translateY(50%)`;
      ref.current.style.opacity = '0';
      ref.current.style.visibility = 'hidden';
      ref.current.style.pointerEvents = 'none';
    }

    // Add transition for smoothness
    ref.current.style.transition = 'all 300ms ease-in-out';
  }, [scrollDirection, props.disabled, ref]);

  if (props.disabled) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default CyclingShowTransition;
