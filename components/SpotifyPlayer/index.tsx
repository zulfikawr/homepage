'use client';

import { useEffect, useState } from 'react';
import { getCurrentTrack } from '@/lib/spotify';
import ImageWithFallback from '@/components/ImageWithFallback';
import { SpotifyTrack } from '@/types/spotify';
import Link from 'next/link';

const SpotifyPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkPlayingTrack = async () => {
      try {
        const response = await getCurrentTrack();
        if (!response) return;

        if (response.status === 200) {
          const data = await response.json();
          if (data.is_playing && data.item) {
            setCurrentTrack(data.item);
            setProgress(data.progress_ms);
            setIsPlaying(true);
            setIsVisible(true);
            return;
          }
        }
        setIsVisible(false);
      } catch (err) {
        console.error('Error checking playing track:', err);
        setIsVisible(false);
      }
    };

    // Initial check
    checkPlayingTrack();

    // Poll every 5 seconds
    const interval = setInterval(checkPlayingTrack, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update progress bar when playing
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1000;
        if (newProgress >= currentTrack.duration_ms) {
          clearInterval(interval);
          return 0;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  if (!isVisible || !currentTrack) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-800 shadow-lg'>
      <div className='w-content mx-auto px-5 py-2'>
        <div className='flex items-center justify-between'>
          {/* Track info */}
          <div className='flex items-center gap-4 min-w-0 flex-1'>
            <div className='w-12 h-12 flex-shrink-0'>
              <ImageWithFallback
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.album.name}
                width={48}
                height={48}
                className='rounded-md'
              />
            </div>
            <div className='min-w-0'>
              <Link
                href={currentTrack.external_urls.spotify}
                className='text-sm font-medium text-white truncate'
              >
                {currentTrack.name}
              </Link>
              <p className='text-xs text-neutral-400 truncate'>
                {currentTrack.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className='hidden md:flex items-center gap-2 flex-1 max-w-md'>
            <span className='text-xs text-neutral-400'>
              {formatTime(progress)}
            </span>
            <div className='flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-green-500'
                style={{
                  width: `${Math.min(100, (progress / currentTrack.duration_ms) * 100)}%`,
                  transition: 'width 0.5s linear',
                }}
              />
            </div>
            <span className='text-xs text-neutral-400'>
              {formatTime(currentTrack.duration_ms)}
            </span>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className='md:hidden mt-2 max-w-sm'>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-neutral-400'>
              {formatTime(progress)}
            </span>
            <div className='flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-green-500'
                style={{
                  width: `${Math.min(100, (progress / currentTrack.duration_ms) * 100)}%`,
                  transition: 'width 0.5s linear',
                }}
              />
            </div>
            <span className='text-xs text-neutral-400'>
              {formatTime(currentTrack.duration_ms)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time (ms -> mm:ss)
function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default SpotifyPlayer;
