'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (icon) return;
    let active = true;
    void loadIcons().then((icons) => {
      if (active) setIcon(icons[name] || null);
    });
    return () => {
      active = false;
    };
  }, [icon, name]);

  if (!icon) {
    return (
      <span
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
