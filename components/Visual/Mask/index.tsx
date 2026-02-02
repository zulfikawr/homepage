'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

interface MaskProps {
  children: React.ReactNode;
  className?: string;
  fadeWidth?: number;
  direction?: 'horizontal' | 'vertical';
}

const Mask = forwardRef<HTMLDivElement, MaskProps>(
  ({ children, className, fadeWidth = 40, direction = 'horizontal' }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => scrollRef.current!);

    const [scrollState, setScrollState] = useState({
      start: false,
      end: false,
    });
    const [containerSize, setContainerSize] = useState(0);

    const updateScrollState = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;

      if (direction === 'horizontal') {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setContainerSize(clientWidth);
        setScrollState({
          start: scrollLeft > 10,
          end: scrollLeft < scrollWidth - clientWidth - 10,
        });
      } else {
        const { scrollTop, scrollHeight, clientHeight } = el;
        setContainerSize(clientHeight);
        setScrollState({
          start: scrollTop > 10,
          end: scrollTop < scrollHeight - clientHeight - 10,
        });
      }
    }, [direction]);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      updateScrollState();
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);

      // Initial check after a short delay to account for content rendering
      const timeoutId = setTimeout(updateScrollState, 100);

      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
        clearTimeout(timeoutId);
      };
    }, [children, updateScrollState]);
    const maskStyles = useMemo(() => {
      const { start, end } = scrollState;
      const size = containerSize || 1;
      const percentageStart = start ? `${(fadeWidth / size) * 100}%` : '0%';
      const percentageEnd = end ? `${(fadeWidth / size) * 100}%` : '0%';

      if (direction === 'horizontal') {
        return {
          '--mask-left': percentageStart,
          '--mask-right': percentageEnd,
          maskImage:
            'linear-gradient(to right, transparent 0%, black var(--mask-left), black calc(100% - var(--mask-right)), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black var(--mask-left), black calc(100% - var(--mask-right)), transparent 100%)',
          transition: '--mask-left 0.3s ease, --mask-right 0.3s ease',
        } as React.CSSProperties;
      } else {
        return {
          '--mask-top': percentageStart,
          '--mask-bottom': percentageEnd,
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black var(--mask-top), black calc(100% - var(--mask-bottom)), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black var(--mask-top), black calc(100% - var(--mask-bottom)), transparent 100%)',
          transition: '--mask-top 0.3s ease, --mask-bottom 0.3s ease',
        } as React.CSSProperties;
      }
    }, [scrollState, fadeWidth, containerSize, direction]);

    return (
      <div
        ref={scrollRef}
        className={twMerge(
          direction === 'horizontal'
            ? 'w-full overflow-x-auto'
            : 'h-full overflow-y-auto',
          'min-w-0',
          className,
        )}
        style={maskStyles}
      >
        {children}
      </div>
    );
  },
);

Mask.displayName = 'Mask';

export default Mask;
