'use client';

import React, { CSSProperties, FC, useEffect, useRef } from 'react';

interface IParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  update: () => void;
  draw: () => void;
}

interface ParticleNetworkProps {
  particleColor?: string;
  lineColor?: string;
  particleCount?: number;
  maxDistance?: number;
  particleSize?: number;
  style?: CSSProperties;
  className?: string;
}

class Particle implements IParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private config: React.RefObject<{
    particleColor: string;
    lineColor: string;
    particleCount: number;
    maxDistance: number;
    particleSize: number;
  }>;

  constructor(
    x: number,
    y: number,
    size: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    config: React.RefObject<{
      particleColor: string;
      lineColor: string;
      particleCount: number;
      maxDistance: number;
      particleSize: number;
    }>,
  ) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = size;
    this.ctx = ctx;
    this.canvas = canvas;
    this.config = config;
  }

  update() {
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.config.current.particleColor;
    this.ctx.fill();
  }
}

const ParticleNetwork: FC<ParticleNetworkProps> = ({
  particleColor = '#FFFFFF',
  lineColor = '#FFFFFF',
  particleCount = 70,
  maxDistance = 150,
  particleSize = 2,
  style = {},
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<IParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const configRef = useRef({
    particleColor,
    lineColor,
    particleCount,
    maxDistance,
    particleSize,
  });
  useEffect(() => {
    configRef.current = {
      particleColor,
      lineColor,
      particleCount,
      maxDistance,
      particleSize,
    };
  }, [particleColor, lineColor, particleCount, maxDistance, particleSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const init = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      particlesRef.current = [];
      for (let i = 0; i < configRef.current.particleCount; i++) {
        const size = Math.random() * configRef.current.particleSize + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push(
          new Particle(x, y, size, context, canvas, configRef),
        );
      }
    };

    const connect = () => {
      const { maxDistance, lineColor } = configRef.current;
      const particles = [
        ...particlesRef.current,
        { x: mouseRef.current.x, y: mouseRef.current.y },
      ];

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            context.beginPath();
            context.strokeStyle = lineColor;
            context.globalAlpha = 1 - distance / maxDistance;
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 1;
    };

    const animate = () => {
      if (!document.hidden) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach((p) => {
          p.update();
          p.draw();
        });
        connect();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseOut = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleVisibilityChange = () => {
      if (document.hidden && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      } else if (!document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    init();
    animate();

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div style={style} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default React.memo(ParticleNetwork);
