'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const [verticalOrigin, setVerticalOrigin] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fire immediately without debounce for snappier response
        setIsVisible(entry.isIntersecting);

        // Determine if the element is entering/leaving from the top or bottom
        // based on its position relative to the viewport.
        if (entry.boundingClientRect.top < 0) {
          setVerticalOrigin('top');
        } else {
          setVerticalOrigin('bottom');
        }
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
        // Use requestAnimationFrame to defer setState call outside effect
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
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

    // If direction is explicitly horizontal or none, respect it
    if (direction === 'left') return `translateX(${distance}px)`;
    if (direction === 'right') return `translateX(-${distance}px)`;
    if (direction === 'none') return 'none';

    // For vertical animations (up/down), adapt to the entry direction
    // If entering from top (scrolling up), we want to start ABOVE (-distance) and move down
    // If entering from bottom (scrolling down), we want to start BELOW (+distance) and move up
    if (verticalOrigin === 'top') {
      return `translateY(-${distance}px)`;
    } else {
      return `translateY(${distance}px)`;
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
