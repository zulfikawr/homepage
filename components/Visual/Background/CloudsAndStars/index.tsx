'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export default function CloudAndStarsBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid rendering on server

  return (
    <div className='fixed inset-0 -z-10 pointer-events-none overflow-hidden'>
      <div
        className={`background-container absolute inset-0 ${
          resolvedTheme === 'light' ? 'invert brightness-[1.5]' : ''
        }`}
      >
        <div className='stars'></div>
        <div className='twinkling'></div>
        <div className='clouds'></div>
      </div>

      <style jsx>{`
        @keyframes move-background {
          from {
            transform: translate3d(0px, 0px, 0px);
          }
          to {
            transform: translate3d(1000px, 0px, 0px);
          }
        }

        .background-container {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }

        .stars {
          background: black
            url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png)
            repeat;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }

        .twinkling {
          width: 10000px;
          height: 100%;
          background: transparent
            url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png')
            repeat;
          background-size: 1000px 1000px;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          animation: move-background 70s linear infinite;
        }

        .clouds {
          width: 10000px;
          height: 100%;
          background: transparent
            url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png')
            repeat;
          background-size: 1000px 1000px;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 3;
          animation: move-background 150s linear infinite;
        }
      `}</style>
    </div>
  );
}
