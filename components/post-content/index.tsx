import { MarkdownRenderer } from '@/components/ui';

export default function PostContent({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}
