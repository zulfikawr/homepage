'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

const PageTransition = ({ children, duration = 0.3, delay = 0 }: Props) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 10); // Reduced from 50ms to 10ms for faster loading
    return () => {
      setMounted(false);
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
