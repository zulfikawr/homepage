import Highlight, { HighlightProps } from 'react-highlight';

interface CustomHighlightProps extends HighlightProps {
  innerHTML?: boolean;
}

const HighlightComponent =
  Highlight as React.ComponentType<CustomHighlightProps>;

export default function PostContent({ content }: { content: string }) {
  return (
    <div className='prose dark:prose-invert lg:prose-xl'>
      <HighlightComponent innerHTML={true}>{content}</HighlightComponent>
    </div>
  );
}
