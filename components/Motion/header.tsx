import React from 'react';

import ScrollWrapper from './scroll';

interface Props {
  componentRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const BoxShadowTransition = ({ componentRef: ref, children }: Props) => {
  const handler = (position: number) => {
    if (!ref?.current) return;

    if (position === 0) {
      ref.current.style.backdropFilter = '';
      ref.current.style.background = 'transparent';
      ref.current.style.borderBottom = '1px solid transparent';
      ref.current.style.boxShadow = 'none';
      return;
    }

    ref.current.style.backdropFilter = '';
    ref.current.style.borderBottom = `1px solid var(--border)`;
    ref.current.style.boxShadow = '';
    ref.current.style.background = 'var(--card)';
  };

  return (
    <ScrollWrapper handler={handler} endPosition={40}>
      {children}
    </ScrollWrapper>
  );
};

export default BoxShadowTransition;
