'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, Button } from '@/components/UI';
import { getRecentlyPlayed, getSpotifyAuthUrl } from '@/lib/spotify';
import { drawer } from '@/components/Drawer';
import { getTimeAgo } from '@/utilities/timeAgo';

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

const SpotifyListeningHistory: React.FC = () => {
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [lastPlayedAt, setLastPlayedAt] = useState<string | null>(null);

  const fetchRecentTracks = async () => {
    try {
      setIsLoading(true);
      const response = await getRecentlyPlayed();

      if (!response) {
        setIsAuthorized(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setRecentTracks(data.items.slice(0, 10));
        setIsAuthorized(true);
        const lastPlayedAt = new Date(data.items[0].played_at)
          .toLocaleDateString('en-GB')
          .split('T')[0];
        setLastPlayedAt(lastPlayedAt);
      }
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTracks();
  }, []);

  const handleSpotifyConnect = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  if (!isAuthorized) {
    return (
      <>
        {/* Header */}
        <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex items-center space-x-4'>
              <Icon name='musicNotes' className='size-[28px] md:size-[32px]' />
              <h1 className='text-xl md:text-2xl font-semibold'>
                Listening History
              </h1>
            </div>
            <div className='flex justify-end space-x-4'>
              <Button
                type='primary'
                icon='spotifyLogo'
                onClick={handleSpotifyConnect}
              >
                Connect Spotify
              </Button>
              <Button icon='close' onClick={() => drawer.close()} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 flex items-center justify-center p-8'>
          <div className='text-center'>
            <p className='text-neutral-600 dark:text-neutral-400 mb-4'>
              Connect your Spotify account to view your listening history.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='musicNotes' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>
              Listening History
            </h1>
          </div>
          <div className='flex justify-end'>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-4'>
          {isLoading ? (
            <div className='text-center text-neutral-500'>Loading...</div>
          ) : recentTracks.length === 0 ? (
            <div className='text-center text-neutral-500'>
              No recent tracks found
            </div>
          ) : (
            recentTracks.map((item, index) => (
              <Link
                key={index}
                href={item.track.external_urls.spotify}
                target='_blank'
                className='flex items-center space-x-4 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-md transition-colors'
              >
                <Image
                  src={
                    item.track.album.images[0]?.url || '/images/placeholder.png'
                  }
                  alt={item.track.album.name}
                  width={64}
                  height={64}
                  className='rounded-md object-cover'
                />
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-md truncate'>
                    {item.track.name}
                  </h3>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
                    {item.track.artists.map((artist) => artist.name).join(', ')}
                  </p>
                  <div className='text-xs text-neutral-500 dark:text-neutral-400'>
                    {getTimeAgo(lastPlayedAt)}
                  </div>
                </div>
                <Icon name='externalLink' className='text-neutral-500' />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SpotifyListeningHistory;
