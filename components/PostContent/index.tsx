import Highlight, { HighlightProps } from 'react-highlight';

interface CustomHighlightProps extends HighlightProps {
  innerHTML?: boolean;
}

const HighlightComponent =
  Highlight as React.ComponentType<CustomHighlightProps>;

export default function PostContent({ content }: { content: string }) {
  return (
    <div className='prose tracking-wide dark:prose-dark lg:prose-xl prose-ul:m-2 prose-ul:ps-5 prose-hr:border-neutral-200 prose-hr:dark:border-neutral-700'>
      <HighlightComponent innerHTML={true}>{content}</HighlightComponent>
    </div>
  );
}
