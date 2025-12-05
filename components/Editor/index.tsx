'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import { Icon, Toggle, Tooltip } from '@/components/UI';
import { IconName } from '@/components/UI/Icon';

interface EditorProps {
  content: string;
  onUpdate: (content: string) => void;
  className?: string;
}

const Editor: React.FC<EditorProps> = ({ content, onUpdate, className }) => {
  const [markdown, setMarkdown] = useState(content);
  const [isViewerMode, setIsViewerMode] = useState(false);
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
      icon: isViewerMode ? 'pencilSimpleLine' : 'eye',
      label: isViewerMode ? 'Edit' : 'Preview',
      action: (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        setIsViewerMode(!isViewerMode);
      },
      active: isViewerMode,
    },
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
  ];

  const inputClassName =
    'h-auto min-h-[300px] md:min-h-[500px] w-full rounded-b-md border border-t-0 border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white resizable-none';

  return (
    <div className={twMerge('', className)}>
      <div className='flex flex-wrap gap-2 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-t-md border border-b-0 border-neutral-300 dark:border-neutral-600'>
        {toolbarButtons.map((button, index) => (
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
      {isViewerMode ? (
        <div
          className='prose dark:prose-invert max-w-none p-2 border border-t-0 border-neutral-300 dark:border-neutral-600 rounded-b-md bg-white dark:bg-neutral-700 min-h-[300px] md:min-h-[500px]'
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={handleChange}
          onSelect={updateCursorStyles}
          className={inputClassName}
          placeholder='Write your markdown here...'
        />
      )}
    </div>
  );
};

Editor.displayName = 'Editor';

export { Editor };
