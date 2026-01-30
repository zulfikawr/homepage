import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import hljs from 'highlight.js';
import { twMerge } from 'tailwind-merge';

import {
  Button,
  drawer,
  Icon,
  MarkdownRenderer,
  Toggle,
  Tooltip,
} from '@/components/UI';
import { IconName } from '@/components/UI/Icon';

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
        <MarkdownRenderer content={markdown} />
      </div>,
    );
  }, [markdown]);

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

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = '') => {
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
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
          updateCursorStyles();
        }
      }, 0);
    },
    [markdown, onUpdate, updateCursorStyles],
  );

  useEffect(() => {
    document.addEventListener('selectionchange', updateCursorStyles);
    return () => {
      document.removeEventListener('selectionchange', updateCursorStyles);
    };
  }, [updateCursorStyles]);

  const toolbarButtons = useMemo(
    () => [
      {
        icon: 'textH' as IconName,
        label: 'Heading',
        active: cursorStyle.heading,
      },
      {
        icon: 'textBolder' as IconName,
        label: 'Bold',
        active: cursorStyle.bold,
      },
      {
        icon: 'textItalic' as IconName,
        label: 'Italic',
        active: cursorStyle.italic,
      },
      {
        icon: 'textUnderline' as IconName,
        label: 'Underline',
        active: cursorStyle.underline,
      },
      {
        icon: 'list' as IconName,
        label: 'List',
        active: cursorStyle.list,
      },
      {
        icon: 'link' as IconName,
        label: 'Link',
        active: cursorStyle.link,
      },
      {
        icon: 'quotes' as IconName,
        label: 'Quote',
        active: cursorStyle.quote,
      },
      {
        icon: 'image' as IconName,
        label: 'Image',
        active: cursorStyle.image,
      },
      {
        icon: 'table' as IconName,
        label: 'Table',
        active: cursorStyle.table,
      },
      {
        icon: 'minus' as IconName,
        label: 'HR',
        active: cursorStyle.hr,
      },
      {
        icon: 'code' as IconName,
        label: 'Inline Code',
        active: cursorStyle.code,
      },
      {
        icon: 'codeBlock' as IconName,
        label: 'Code Block',
        active: cursorStyle.codeBlock,
      },
    ],
    [cursorStyle],
  );

  const handleToolbarAction = useCallback(
    (label: string) => {
      switch (label) {
        case 'Heading':
          insertMarkdown('# ', '');
          break;
        case 'Bold':
          insertMarkdown('**', '**');
          break;
        case 'Italic':
          insertMarkdown('_', '_');
          break;
        case 'Underline':
          insertMarkdown('<u>', '</u>');
          break;
        case 'List':
          insertMarkdown('- ', '');
          break;
        case 'Link':
          insertMarkdown('[', '](url)');
          break;
        case 'Quote':
          insertMarkdown('> ', '');
          break;
        case 'Image':
          insertMarkdown('![alt](', ')');
          break;
        case 'Table':
          insertMarkdown(
            '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n',
          );
          break;
        case 'HR':
          insertMarkdown('\n---\n');
          break;
        case 'Inline Code':
          insertMarkdown('`', '`');
          break;
        case 'Code Block':
          insertMarkdown('\n```\n', '\n```\n');
          break;
      }
    },
    [insertMarkdown],
  );

  const highlightedContent = useMemo(() => {
    try {
      return hljs.highlight(markdown || '', { language: 'markdown' }).value;
    } catch {
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
      <div className='relative flex items-center bg-muted dark:bg-card rounded-t-md border border-b-0 border shrink-0 cursor-default overflow-visible'>
        {/* Formatting Tools */}
        <div className='flex flex-1 items-center px-2 py-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mt-20 pt-20 -ml-20 pl-20'>
          <div className='flex items-center gap-2 overflow-visible min-w-max h-9'>
            {toolbarButtons.map((button, index) => (
              <Tooltip key={index} text={button.label} position='top'>
                <Toggle
                  isActive={button.active}
                  onChange={(e) => {
                    if (e && 'preventDefault' in e) e.preventDefault();
                    handleToolbarAction(button.label);
                  }}
                  className='px-2 rounded-md'
                >
                  <Icon name={button.icon} className='w-5 h-5' />
                </Toggle>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Fixed Preview Button */}
        <div className='flex items-center px-2 py-1 border-l border bg-muted dark:bg-card ml-auto shrink-0 sticky right-0 z-10'>
          <Tooltip text='Preview' position='top'>
            <Button
              variant='ghost'
              icon='eye'
              onClick={(e) => {
                e.preventDefault();
                handlePreview();
              }}
              className='px-2 h-8 cursor-pointer'
            />
          </Tooltip>
        </div>
      </div>
      <div
        className={twMerge(
          'relative w-full h-[300px] md:h-[500px] border border-t-0 border rounded-b-md bg-muted/50 dark:bg-background overflow-y-auto',
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
              'absolute inset-0 w-full h-full bg-transparent !text-transparent caret-primary resize-none focus:outline-none overflow-hidden',
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
