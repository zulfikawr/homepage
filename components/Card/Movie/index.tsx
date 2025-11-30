import { Card } from '@/components/Card';
import openLink from '@/utilities/externalLink';
import { Movie } from '@/types/movie';
import Separator from '@/components/UI/Separator';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/UI/Icon';

interface MovieCardProps {
  movie: Movie;
  openForm?: boolean;
  isInForm?: boolean;
}

export default function MovieCard({
  movie,
  openForm,
  isInForm,
}: MovieCardProps) {
  const router = useRouter();
  const rating = movie.rating || 0;

  const handleCardClick = () => {
    if (isInForm) return;

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
        className={`p-0.5 ${filled ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}
        aria-hidden
      >
        <div className='w-4 h-4'>
          <Icon name='star' />
        </div>
      </div>
    );
  };

  return (
    <Card
      onClick={handleCardClick}
      openForm={openForm}
      isInForm={isInForm}
      className={`${openForm ? 'w-full' : ''}`}
    >
      <div className='flex flex-1 items-center'>
        <div className='flex-shrink-0 px-4.5 py-4'>
          <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-neutral-200 dark:shadow-none dark:border-neutral-600'>
            <ImageWithFallback
              width={35}
              height={52}
              src={movie.posterUrl}
              alt={movie.title}
              className='h-full w-full object-cover'
              loading='lazy'
              type='portrait'
            />
          </div>
        </div>
        <div className='py-2 pr-4 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {movie.title}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-neutral-500 dark:text-neutral-400 lg:text-sm'>
            Released {movie.releaseDate}
          </p>
        </div>
      </div>

      <Separator margin='0' />

      <div className='flex w-full items-center justify-between px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <div className='flex items-center gap-2'>
          <span className='text-neutral-400'>Rating</span>
          <div className='flex items-center gap-0.5'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} index={i} />
            ))}
          </div>
        </div>
        <div className='text-neutral-400'>View</div>
      </div>
    </Card>
  );
}

export { MovieCard };
