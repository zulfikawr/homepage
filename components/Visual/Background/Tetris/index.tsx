'use client';

import { useEffect, useRef } from 'react';

import { TetrisGame } from './component';

export default function TetrisBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TetrisGame | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameRef.current = new TetrisGame(
      canvas,
      window.innerWidth,
      window.innerHeight,
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameRef.current) {
        gameRef.current.handleKeyDown(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className='fixed inset-0 -z-10 pointer-events-none overflow-hidden'>
      <canvas ref={canvasRef} className='absolute inset-0' />
    </div>
  );
}
