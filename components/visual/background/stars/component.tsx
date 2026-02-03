'use client';

import React, { CSSProperties, useEffect, useRef } from 'react';

interface StarsProps {
  starColor?: string;
  starSize?: number;
  starMinScale?: number;
  overflowThreshold?: number;
  starCount?: number;
  style?: CSSProperties;
  className?: string;
}

const Stars: React.FC<StarsProps> = ({
  starColor = '#fff',
  starSize = 3,
  starMinScale = 0.2,
  overflowThreshold = 50,
  starCount: initialStarCount,
  style = {},
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const configRef = useRef({
    starColor,
    starSize,
    starMinScale,
    overflowThreshold,
    starCount:
      initialStarCount ??
      (typeof window !== 'undefined'
        ? Math.floor((window.innerWidth + window.innerHeight) / 8)
        : 1000),
  });

  useEffect(() => {
    configRef.current.starColor = starColor;
    configRef.current.starSize = starSize;
    configRef.current.starMinScale = starMinScale;
    configRef.current.overflowThreshold = overflowThreshold;
    if (initialStarCount !== undefined) {
      configRef.current.starCount = initialStarCount;
    }
  }, [starColor, starSize, starMinScale, overflowThreshold, initialStarCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let scale = 1;
    let width = 0;
    let height = 0;

    type Star = {
      x: number;
      y: number;
      z: number;
    };

    const stars: Star[] = [];
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let touchInput = false;

    const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

    const generate = () => {
      stars.length = 0; // Clear existing stars
      for (let i = 0; i < configRef.current.starCount; i++) {
        stars.push({
          x: 0,
          y: 0,
          z:
            configRef.current.starMinScale +
            Math.random() * (1 - configRef.current.starMinScale),
        });
      }
    };

    const placeStar = (star: Star) => {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    };

    const recycleStar = (star: Star) => {
      let direction = 'z';
      const { overflowThreshold } = configRef.current;
      const vx = Math.abs(velocity.x);
      const vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        const axis =
          Math.random() < vx / (vx + vy)
            ? vx > vy
              ? 'h'
              : 'v'
            : vy > vx
              ? 'v'
              : 'h';
        if (axis === 'h') {
          direction = velocity.x > 0 ? 'l' : 'r';
        } else {
          direction = velocity.y > 0 ? 't' : 'b';
        }
      }

      star.z =
        configRef.current.starMinScale +
        Math.random() * (1 - configRef.current.starMinScale);

      if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === 'l') {
        star.x = -overflowThreshold;
        star.y = height * Math.random();
      } else if (direction === 'r') {
        star.x = width + overflowThreshold;
        star.y = height * Math.random();
      } else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -overflowThreshold;
      } else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + overflowThreshold;
      }
    };

    const resize = () => {
      scale = window.devicePixelRatio || 1;
      width = window.innerWidth * scale;
      height = window.innerHeight * scale;
      canvas.width = width;
      canvas.height = height;
      stars.forEach(placeStar);
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = configRef.current.starSize * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = configRef.current.starColor;

        context.beginPath();
        context.moveTo(star.x, star.y);
        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;
        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;
        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      });
    };

    const update = () => {
      velocity.tx *= 0.96;
      velocity.ty *= 0.96;
      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;

      stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;
        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        const { overflowThreshold } = configRef.current;
        if (
          star.x < -overflowThreshold ||
          star.x > width + overflowThreshold ||
          star.y < -overflowThreshold ||
          star.y > height + overflowThreshold
        ) {
          recycleStar(star);
        }
      });
    };

    const step = () => {
      update();
      render();
      animationRef.current = requestAnimationFrame(step);
    };

    const movePointer = (x: number, y: number) => {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        const ox = x - pointerX;
        const oy = y - pointerY;
        velocity.tx += (ox / (8 * scale)) * (touchInput ? 1 : -1);
        velocity.ty += (oy / (8 * scale)) * (touchInput ? 1 : -1);
      }
      pointerX = x;
      pointerY = y;
    };

    const onMouseMove = (e: MouseEvent) => {
      touchInput = false;
      movePointer(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      touchInput = true;
      movePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onMouseLeave = () => {
      pointerX = null;
      pointerY = null;
    };

    generate();
    resize();
    animationRef.current = requestAnimationFrame(step);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    // Use a passive touch listener so we don't block page scrolling on mobile
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseLeave);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseLeave);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div style={style} className={className}>
      <canvas ref={canvasRef} className='block w-full h-full' />
    </div>
  );
};

export default Stars;
