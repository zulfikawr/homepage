'use client';

import { useTheme } from 'next-themes';
import React, { useMemo } from 'react';

export default function CloudAndStarsBackground() {
  const { resolvedTheme } = useTheme();

  // Use useMemo to avoid re-generating styles on every render
  const styles = useMemo(
    () => `
    @keyframes move-background {
      from { transform: translate3d(0px, 0px, 0px); }
      to { transform: translate3d(1000px, 0px, 0px); }
    }

    .background-container-clouds {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: -10;
      pointer-events: none;
      overflow: hidden;
      background-color: black;
    }

    .stars-layer {
      background: black url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat;
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      z-index: 0;
    }

    .twinkling-layer {
      width: 10000px;
      height: 100%;
      background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png') repeat;
      background-size: 1000px 1000px;
      position: absolute;
      right: 0; top: 0; bottom: 0;
      z-index: 1;
      animation: move-background 70s linear infinite;
    }

    .clouds-layer {
      width: 10000px;
      height: 100%;
      background: transparent url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png') repeat;
      background-size: 1000px 1000px;
      position: absolute;
      right: 0; top: 0; bottom: 0;
      z-index: 2;
      animation: move-background 150s linear infinite;
    }

    .light-mode-invert {
      filter: invert(1) brightness(1.5);
    }
  `,
    [],
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className={`background-container-clouds ${
          resolvedTheme === 'light' ? 'light-mode-invert' : ''
        }`}
      >
        <div className='stars-layer'></div>
        <div className='twinkling-layer'></div>
        <div className='clouds-layer'></div>
      </div>
    </>
  );
}
