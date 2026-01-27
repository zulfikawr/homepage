'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Icon } from '@/components/UI';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export default function AudioPlayer({ src, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <audio ref={audioRef} src={src} preload='metadata' />

      {/* Controls */}
      <div className='flex items-center gap-2 flex-nowrap'>
        {/* Play/Pause Button */}
        <Button
          type='outline'
          onClick={togglePlay}
          className='flex-shrink-0 p-0 w-8 h-8'
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={16} />
        </Button>

        {/* Mute Button */}
        <Button
          type='outline'
          onClick={toggleMute}
          className='flex-shrink-0 p-0 w-8 h-8'
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <Icon name={isMuted ? 'speakerSlash' : 'speaker'} size={16} />
        </Button>

        {/* Progress Slider */}
        <input
          type='range'
          min='0'
          max={duration || 0}
          value={currentTime}
          onChange={handleSliderChange}
          className='flex-1 h-1.5 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gruv-green
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm
            [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gruv-green [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-sm'
          style={{
            background: `linear-gradient(to right, var(--color-gruv-green) 0%, var(--color-gruv-green) ${progress}%, rgba(128,128,128,0.2) ${progress}%, rgba(128,128,128,0.2) 100%)`,
          }}
        />

        {/* Time Display */}
        <div className='text-xs text-muted-foreground font-mono flex-shrink-0 whitespace-nowrap'>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
