'use client';

import React, { useRef, useState, MouseEvent, CSSProperties } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
  glowColor?: string;
  glowSize?: number;
}

const GlowingBackground = ({
  className = '',
  children,
  glowColor = 'rgba(255, 255, 255, 0.5)',
  glowSize = 200,
}: Props) => {
  const [glowStyles, setGlowStyles] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setGlowStyles({
      background: `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent ${glowSize}px)`,
    });
  };

  const handleMouseLeave = () => {
    setGlowStyles({});
  };

  return (
    <div
      className={`glowing-background ${className}`}
      style={glowStyles}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default GlowingBackground;
