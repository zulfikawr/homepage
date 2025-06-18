'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function StarryBackground() {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <div className='fixed inset-0 -z-10 pointer-events-none overflow-hidden'>
      <div
        className={`absolute inset-0 ${!isDark ? 'invert brightness-[1.3]' : ''}`}
      >
        <div className='stars'></div>
        <div className='twinkling'></div>
        <div className='clouds'></div>
      </div>

      <style jsx>{`
        .stars {
          background: black
            url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png')
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
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 1;
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
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 2;
          animation: move-background 150s linear infinite;
        }

        @keyframes move-background {
          from {
            transform: translate3d(0px, 0px, 0px);
          }
          to {
            transform: translate3d(1000px, 0px, 0px);
          }
        }
      `}</style>
    </div>
  );
}
