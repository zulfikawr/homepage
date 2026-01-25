import ScrollWrapper from './scroll';
import { useTheme } from 'next-themes';
import React from 'react';
import { useEffectToggle } from '@/contexts/effectContext';

interface Props {
  componentRef: React.MutableRefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const BoxShadowTransition = ({ componentRef: ref, children }: Props) => {
  const { resolvedTheme } = useTheme();
  const { effectEnabled } = useEffectToggle();

  const handler = (position: number) => {
    if (!ref?.current) return;

    if (position === 0) {
      ref.current.style.backdropFilter = '';
      ref.current.style.background = 'transparent';
      ref.current.style.borderBottom = '1px solid transparent';
      ref.current.style.boxShadow = 'none';
      return;
    }

    const ratio = Math.min(position / 40, 1);

    if (effectEnabled) {
      ref.current.style.backdropFilter = 'blur(12px)';
      ref.current.style.borderBottom = `1px solid var(--border)`;
      ref.current.style.background =
        resolvedTheme === 'dark'
          ? `rgba(50, 48, 47, ${0.8 * ratio})` // bg-card (dark) with opacity
          : `rgba(249, 245, 215, ${0.8 * ratio})`; // bg-card (light) with opacity

      ref.current.style.boxShadow = 'var(--shadow-header)';
    } else {
      ref.current.style.backdropFilter = '';
      ref.current.style.borderBottom = `1px solid var(--border)`;
      ref.current.style.boxShadow = '';
      ref.current.style.background = 'var(--card)';
    }
  };

  return (
    <ScrollWrapper handler={handler} endPosition={40}>
      {children}
    </ScrollWrapper>
  );
};

export default BoxShadowTransition;
