import { renderMarkdown } from '@/utilities/renderMarkdown';

export default function PostContent({ content }: { content: string }) {
  return (
    <div
      className='prose dark:prose-invert'
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
