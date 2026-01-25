import { saveSpotifyTokens } from '@/lib/spotify';
import { toast } from '@/components/Toast';
import { Skeleton } from '@/components/UI';

function CallbackContent() {
// ... (omitted for brevity)
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <Skeleton width={48} height={48} variant='circle' />
      <Skeleton width={200} height={24} />
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
          <Skeleton width={48} height={48} variant='circle' />
          <Skeleton width={200} height={24} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
