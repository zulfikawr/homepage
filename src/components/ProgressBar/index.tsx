import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const ProgressBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: string | number | NodeJS.Timeout;
    let incrementAmount = 5;
    let currentProgress = 0;

    const handleRouteChangeStart = () => {
      setLoading(true);
      currentProgress = 0;
      setProgress(0);

      progressInterval = setInterval(() => {
        if (currentProgress < 30) {
          incrementAmount = 5;
        } else if (currentProgress < 60) {
          incrementAmount = 3;
        } else if (currentProgress < 80) {
          incrementAmount = 1;
        } else {
          incrementAmount = 0.5;
        }

        if (currentProgress < 90) {
          currentProgress += incrementAmount;
          setProgress(currentProgress);
        }
      }, 100);
    };

    const handleRouteChangeComplete = () => {
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    const handleRouteChangeError = () => {
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      clearInterval(progressInterval);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-50 bg-gray-100 dark:bg-gray-800 transition-opacity duration-300 ${
        progress === 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className='h-full bg-black dark:bg-white transition-all ease-out duration-300'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
