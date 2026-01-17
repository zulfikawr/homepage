import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import { Icon, Toggle, Tooltip, Button } from '@/components/UI';
import { IconName } from '@/components/UI/Icon';
import hljs from 'highlight.js';
import { drawer } from '@/components/Drawer';

interface EditorProps {
  content: string;
  onUpdate: (content: string) => void;
  className?: string;
  textareaClassName?: string;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onUpdate,
  className,
  textareaClassName,
}) => {
  const [markdown, setMarkdown] = useState(content);
  const [cursorStyle, setCursorStyle] = useState<{ [key: string]: boolean }>(
    {},
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setMarkdown(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdown(newContent);
    onUpdate(newContent);
  };

  const handlePreview = useCallback(() => {
    drawer.open(
      <div className='flex-1 overflow-y-auto p-6 lg:p-10'>
        <div
          className='prose dark:prose-invert max-w-none'
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      </div>,
    );
  }, [markdown]);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const newText = `${markdown.slice(0, start)}${prefix}${selectedText}${suffix}${markdown.slice(end)}`;

    setMarkdown(newText);
    onUpdate(newText);

    const newCursorPos = start + prefix.length + selectedText.length;
    setTimeout(() => {
      if (textarea) {
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        textarea.focus();
        updateCursorStyles();
      }
    }, 0);
  };

  const getCursorContext = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { context: '', offset: 0 };

    const cursorPos = textarea.selectionStart;
    const lookBehind = 50;
    const lookAhead = 50;

    const start = Math.max(0, cursorPos - lookBehind);
    const end = Math.min(markdown.length, cursorPos + lookAhead);
    const context = markdown.slice(start, end);
    return { context, offset: start };
  }, [markdown]);

  const updateCursorStyles = useCallback(() => {
    const { context, offset } = getCursorContext();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const relativePos = cursorPos - offset;

    const testInlineMatch = (regex: RegExp) => {
      let match;
      while ((match = regex.exec(context)) !== null) {
        if (
          match.index < relativePos &&
          relativePos <= match.index + match[0].length
        ) {
          return true;
        }
      }
      return false;
    };

    setCursorStyle({
      bold: testInlineMatch(/\*\*(?!\s)([^*]+?)(?!\s)\*\*/g),
      italic: testInlineMatch(/_(?!\s)([^_]+?)(?!\s)_/g),
      underline: testInlineMatch(/<u>(.*?)<\/u>/g),
      quote: testInlineMatch(/^>\s.*$/gm),
      list: testInlineMatch(/(^|\n)-\s.*$/gm),
      heading: testInlineMatch(/(^|\n)#+\s.*$/gm),
      link: testInlineMatch(/\[(.*?)\]\((.*?)\)/g),
      image: testInlineMatch(/!\[(.*?)\]\((.*?)\)/g),
      table: testInlineMatch(/^\|(.+\|)+\n\|([ -:|]+)\n(\|.*\n)*/gm),
      hr: testInlineMatch(/(^|\n)(\*\s?){3,}|(-\s?){3,}|(_\s?){3,}/g),
      code: testInlineMatch(/`[^`]+`/g),
      codeBlock: testInlineMatch(/```[\s\S]*?```/g),
    });
  }, [getCursorContext]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateCursorStyles);
    return () => {
      document.removeEventListener('selectionchange', updateCursorStyles);
    };
  }, [updateCursorStyles]);

  const toolbarButtons: {
    icon: IconName;
    label: string;
    action: () => void;
    active: boolean;
  }[] = [
    {
      icon: 'heading',
      label: 'Heading',
      action: () => insertMarkdown('# ', ''),
      active: cursorStyle.heading,
    },
    {
      icon: 'bold',
      label: 'Bold',
      action: () => insertMarkdown('**', '**'),
      active: cursorStyle.bold,
    },
    {
      icon: 'italic',
      label: 'Italic',
      action: () => insertMarkdown('_', '_'),
      active: cursorStyle.italic,
    },
    {
      icon: 'underline',
      label: 'Underline',
      action: () => insertMarkdown('<u>', '</u>'),
      active: cursorStyle.underline,
    },
    {
      icon: 'list',
      label: 'List',
      action: () => insertMarkdown('- ', ''),
      active: cursorStyle.list,
    },
    {
      icon: 'link',
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
      active: cursorStyle.link,
    },
    {
      icon: 'quote',
      label: 'Quote',
      action: () => insertMarkdown('> ', ''),
      active: cursorStyle.quote,
    },
    {
      icon: 'image',
      label: 'Image',
      action: () => insertMarkdown('![alt](', ')'),
      active: cursorStyle.image,
    },
    {
      icon: 'table',
      label: 'Table',
      action: () =>
        insertMarkdown(
          '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n',
        ),
      active: cursorStyle.table,
    },
    {
      icon: 'minus',
      label: 'HR',
      action: () => insertMarkdown('\n---\n'),
      active: cursorStyle.hr,
    },
    {
      icon: 'code',
      label: 'Inline Code',
      action: () => insertMarkdown('`', '`'),
      active: cursorStyle.code,
    },
    {
      icon: 'codeBlock',
      label: 'Code Block',
      action: () => insertMarkdown('\n```\n', '\n```\n'),
      active: cursorStyle.codeBlock,
    },
    {
      icon: 'eye',
      label: 'Preview',
      action: () => handlePreview(),
      active: false,
    },
  ];

  const highlightedContent = useMemo(() => {
    try {
      return hljs.highlight(markdown || '', { language: 'markdown' }).value;
    } catch (e) {
      return markdown || '';
    }
  }, [markdown]);

  const sharedStyles: React.CSSProperties = {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '16px',
    margin: 0,
    border: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    tabSize: 4,
    fontVariantLigatures: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div className={twMerge('flex flex-col', className)}>
      <div className='relative flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-t-md border border-b-0 border-neutral-300 dark:border-neutral-600 shrink-0 overflow-visible'>
        {/* Scrollable Formatting Tools */}
        <div className='flex flex-nowrap items-center gap-2 px-2 py-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
          {toolbarButtons
            .filter((b) => b.label !== 'Preview')
            .map((button, index) => (
              <Tooltip key={index} text={button.label} position='top'>
                <Toggle
                  isActive={button.active}
                  onChange={(e) => {
                    if (e && 'preventDefault' in e) e.preventDefault();
                    (
                      button.action as (
                        e?: React.MouseEvent<HTMLButtonElement>,
                      ) => void
                    )(e);
                  }}
                  className='px-2 rounded-md'
                >
                  <Icon name={button.icon} className='w-5 h-5' />
                </Toggle>
              </Tooltip>
            ))}
        </div>

        {/* Fixed Preview Button */}
        <div className='flex items-center px-2 py-1 border-l border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 ml-auto shrink-0 sticky right-0'>
          <Tooltip text='Preview' position='top'>
            <Button
              type='ghost'
              icon='eye'
              onClick={(e) => {
                e.preventDefault();
                handlePreview();
              }}
              className='px-2 h-8'
            />
          </Tooltip>
        </div>
      </div>
      <div
        className={twMerge(
          'relative w-full h-[300px] md:h-[500px] border border-t-0 border-neutral-300 dark:border-neutral-600 rounded-b-md bg-neutral-50 dark:bg-neutral-900 overflow-y-auto',
          className,
        )}
      >
        <div className='relative w-full min-h-full'>
          <pre
            aria-hidden='true'
            style={sharedStyles}
            className={twMerge(
              'relative w-full m-0 pointer-events-none hljs bg-transparent min-h-full',
              textareaClassName,
            )}
            dangerouslySetInnerHTML={{
              __html:
                highlightedContent + (markdown.endsWith('\n') ? '\n' : ''),
            }}
          />
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={handleChange}
            onSelect={updateCursorStyles}
            style={sharedStyles}
            className={twMerge(
              'absolute inset-0 w-full h-full bg-transparent !text-transparent caret-neutral-900 dark:caret-neutral-100 resize-none focus:outline-none overflow-hidden',
              textareaClassName,
            )}
            placeholder='Write your markdown here...'
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

Editor.displayName = 'Editor';

export { Editor };
