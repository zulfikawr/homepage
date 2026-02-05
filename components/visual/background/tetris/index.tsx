'use client';

import React, { useEffect, useRef } from 'react';

import { TetrisGame } from './component';

const TetrisBackground = React.memo(function TetrisBackground({
  isPreview = false,
}: {
  isPreview?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TetrisGame | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = isPreview ? parent.clientWidth : window.innerWidth;
    const height = isPreview ? parent.clientHeight : window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    gameRef.current = new TetrisGame(canvas, width, height);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameRef.current) {
        gameRef.current.handleKeyDown(e);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && gameRef.current?.cleanup) {
        gameRef.current.cleanup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, [isPreview]);

  return (
    <div
      className={`${isPreview ? 'absolute' : 'fixed'} inset-0 -z-10 h-full w-full pointer-events-none overflow-hidden`}
    >
      <canvas ref={canvasRef} className='absolute inset-0' />
    </div>
  );
});

export default TetrisBackground;
