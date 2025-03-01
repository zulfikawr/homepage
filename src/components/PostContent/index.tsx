import 'highlight.js/styles/atom-one-dark.css';
import Highlight, { HighlightProps } from 'react-highlight';

interface CustomHighlightProps extends HighlightProps {
  innerHTML?: boolean;
}

const HighlightComponent =
  Highlight as React.ComponentType<CustomHighlightProps>;

export default function PostContent({ content }: { content: string }) {
  return (
    <div className='prose tracking-wide dark:prose-dark lg:prose-xl prose-ul:m-2 prose-ul:ps-5 prose-hr:border-gray-200 prose-hr:dark:border-gray-700'>
      <HighlightComponent innerHTML={true}>{content}</HighlightComponent>
    </div>
  );
}
