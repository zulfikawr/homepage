'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScrollDirection } from '@/hooks';

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
}

const ViewTransition = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 20,
  duration = 0.3,
  className = '',
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fire immediately without debounce for snappier response
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '50px',
      },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);

      // Fallback: if element is already in viewport
      const rect = currentRef.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
      }
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    // Use opposite direction when scrolling up for smoother appearance
    const effectiveDirection =
      direction !== 'none' && scrollDirection === 'up'
        ? scrollDirection === 'up' && direction === 'up'
          ? 'down'
          : direction === 'down'
            ? 'up'
            : direction
        : direction;

    switch (effectiveDirection) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'none':
        return 'none';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.32, 0.72, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.32, 0.72, 0.36, 1) ${delay}s`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {children}
    </div>
  );
};

export default ViewTransition;
