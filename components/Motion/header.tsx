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
      ref.current.style.borderBottom = 'transparent';
      ref.current.style.boxShadow = 'none';
      return;
    }

    const ratio = Math.min(position / 40, 1);

    if (effectEnabled) {
      ref.current.style.backdropFilter = 'blur(12px)';
      ref.current.style.borderBottom =
        resolvedTheme === 'dark'
          ? `1px solid rgba(255, 255, 255, ${0.1 * ratio})`
          : `1px solid rgba(255, 255, 255, ${0.2 * ratio})`;

      ref.current.style.background =
        resolvedTheme === 'dark'
          ? `rgba(255, 255, 255, ${0.05 * ratio})`
          : `rgba(255, 255, 255, ${0.5 * ratio})`;

      ref.current.style.boxShadow =
        resolvedTheme === 'dark'
          ? `0 1px 3px rgba(0, 0, 0, ${0.15 * ratio})`
          : `0 1px 4px rgba(0, 0, 0, ${0.1 * ratio})`;
    } else {
      ref.current.style.backdropFilter = '';
      ref.current.style.border = '';
      ref.current.style.boxShadow = '';
      ref.current.style.background =
        resolvedTheme === 'dark'
          ? `rgba(38, 38, 38, ${ratio})`
          : `rgba(255, 255, 255, ${ratio})`;
    }
  };

  return (
    <ScrollWrapper handler={handler} endPosition={40}>
      {children}
    </ScrollWrapper>
  );
};

export default BoxShadowTransition;
