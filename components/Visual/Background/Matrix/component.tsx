'use client';

import React, { useRef, useEffect, CSSProperties, FC } from 'react';

interface DigitalRainProps {
  characterColor?: string;
  fadeColor?: string;
  fontSize?: number;
  style?: CSSProperties;
  className?: string;
}

const DigitalRain: FC<DigitalRainProps> = ({
  characterColor = '#00F000',
  fadeColor = 'rgba(0, 0, 0, 0.05)',
  fontSize = 16,
  style = {},
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const configRef = useRef({ characterColor, fadeColor, fontSize });
  useEffect(() => {
    configRef.current = { characterColor, fadeColor, fontSize };
  }, [characterColor, fadeColor, fontSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const katakana =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const characters = katakana + alphabet + numbers;

    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      columns = Math.floor(canvas.width / configRef.current.fontSize);

      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
    };

    const draw = () => {
      context.fillStyle = configRef.current.fadeColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = configRef.current.characterColor;
      context.font = `${configRef.current.fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length),
        );

        context.fillText(
          text,
          i * configRef.current.fontSize,
          drops[i] * configRef.current.fontSize,
        );

        if (
          drops[i] * configRef.current.fontSize > canvas.height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={style} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DigitalRain;
