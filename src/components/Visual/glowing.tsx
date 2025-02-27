import type React from 'react';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface GlowingBackgroundProps {
  rounded?: 'sm' | 'md' | 'xl';
  mouseX?: number;
  mouseY?: number;
}

const GlowingBackground = ({
  rounded = 'md',
  mouseX,
  mouseY,
}: GlowingBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const borderRadius = {
    sm: '0.125rem',
    md: '0.375rem',
    xl: '0.75rem',
  }[rounded];

  // Use the provided mouse coordinates for the gradient position
  const background =
    resolvedTheme === 'dark'
      ? `radial-gradient(200px circle at ${mouseX || 0}px ${mouseY || 0}px, rgba(255, 255, 255, 0.1), transparent)`
      : 'transparent';

  const backgroundColor =
    resolvedTheme === 'dark' ? 'rgb(38,38,38)' : 'transparent';

  const styles: React.CSSProperties = {
    borderRadius,
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'absolute',
    zIndex: 1,
    opacity: 1,
    top: '1px',
    bottom: '1px',
    left: '1px',
    right: '1px',
    background,
    backgroundColor,
    contain: 'strict',
    transition: 'opacity 400ms ease 0s',
  };

  return <div style={styles} />;
};

export default GlowingBackground;
