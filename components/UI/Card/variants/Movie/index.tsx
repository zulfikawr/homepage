'use client';

import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Icon } from '@/components/UI/Icon';
import { Separator } from '@/components/UI/Separator';
import { Movie } from '@/types/movie';
import openLink from '@/utilities/externalLink';

import { Card } from '../..';

interface MovieCardProps {
  movie: Movie;
  openForm?: boolean;
  isPreview?: boolean;
}

export default function MovieCard({
  movie,
  openForm,
  isPreview,
}: MovieCardProps) {
  const router = useRouter();
  const rating = movie.rating || 0;

  const handleCardClick = () => {
    if (isPreview) return;

    if (openForm) {
      router.push(`/database/movies/${movie.id}/edit`);
    } else {
      if (movie.imdbLink) openLink(movie.imdbLink);
    }
  };

  const Star = ({ index }: { index: number }) => {
    const filled = index <= rating;
    return (
      <div
        className={`p-0.5 ${filled ? 'text-gruv-yellow' : 'text-muted-foreground dark:text-muted-foreground'}`}
        aria-hidden
      >
        <Icon name='star' className='size-[12px] md:size-4.5' />
      </div>
    );
  };

  return (
    <div className={isPreview ? 'w-full' : ''}>
      <Card
        onClick={handleCardClick}
        openForm={openForm}
        isPreview={isPreview}
        className={`${openForm || isPreview ? 'w-full' : ''}`}
      >
        {isPreview ? (
          <>
            <div className='flex flex-1 items-center'>
              <div className='flex-shrink-0 px-4.5 py-4'>
                <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-muted dark:shadow-none '>
                  <ImageWithFallback
                    width={35}
                    height={52}
                    src={movie.posterUrl}
                    alt={movie.title}
                    className='h-full w-full object-cover'
                    loading='lazy'
                    type='portrait'
                    sizes='35px'
                  />
                </div>
              </div>
              <div className='py-2 pr-4 space-y-1'>
                <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-foreground'>
                  {movie.title}
                </p>
                <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-medium tracking-wide text-gruv-aqua lg:text-sm'>
                  Released {movie.releaseDate}
                </p>
              </div>
            </div>

            <Separator margin='0' />

            <div className='flex items-center gap-2 px-4.5 py-2 text-xs font-light text-muted-foreground'>
              <span className='text-gruv-aqua/80 font-medium'>Rating</span>
              <div className='flex items-center gap-0.5'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} index={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Main container for image and hover overlay */}
            <div className='relative h-full overflow-hidden group'>
              {/* Image container */}
              <div className='relative aspect-[2/3] w-full bg-muted dark:bg-card'>
                <ImageWithFallback
                  className='z-10 object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50'
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  type='portrait'
                  sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
                />
              </div>

              {/* Hover overlay with title */}
              <div className='absolute inset-0 z-20 flex items-center justify-center p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none'>
                <div className='text-center max-w-full'>
                  <h2 className='text-sm font-bold tracking-wider text-foreground line-clamp-3 drop-shadow-md'>
                    {movie.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className='flex w-full items-center justify-center px-1 py-2 gap-0.5'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} index={i} />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export { MovieCard };
