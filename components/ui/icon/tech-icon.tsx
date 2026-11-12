'use client';

import { useEffect, useRef, useState } from 'react';

type TechIconData = { viewBox: string; body: string };
type TechIconMap = Record<string, TechIconData>;

let cache: TechIconMap | null = null;
let loadPromise: Promise<TechIconMap> | null = null;

const loadIcons = () => {
  if (cache) return Promise.resolve(cache);
  if (!loadPromise) {
    loadPromise = import('./tech-icons').then((module) => {
      cache = module.TECH_ICONS;
      return cache;
    });
  }
  return loadPromise;
};

export default function TechIcon({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [icon, setIcon] = useState<TechIconData | null>(cache?.[name] || null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || icon) return;
    let active = true;
    void loadIcons().then((icons) => {
      if (active) setIcon(icons[name] || null);
    });
    return () => {
      active = false;
    };
  }, [icon, name, visible]);

  if (!icon) {
    return (
      <span
        ref={ref}
        className={className}
        style={{ display: 'inline-block', width: size, height: size, ...style }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      className={className}
      style={style}
      aria-hidden='true'
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
