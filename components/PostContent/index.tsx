import { Skeleton } from '@/components/UI';
import { renderMarkdown } from '@/utilities/renderMarkdown';

export default function PostContent({
  content,
  isLoading = false,
}: {
  content: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className='max-w-none space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='space-y-3'>
            <Skeleton width='100%' height={20} />
            <Skeleton width='100%' height={20} />
            <Skeleton width='100%' height={20} />
            <Skeleton width='75%' height={20} />
            <div className='h-4' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className='max-w-none prose dark:prose-invert'
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
