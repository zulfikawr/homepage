'use client';

import { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import Heading, { Level } from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import { Button, Dropdown, Input, Textarea } from '@/components/UI';
import Tooltip from '@/components/UI/Tooltip';
import Toggle from '@/components/UI/Toggle';

interface EditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
}

interface HeadingOption {
  level: Level;
  label: string;
}

export const Editor = ({ content = '', onUpdate }: EditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Heading,
      Paragraph,
      Image,
      Strike,
      Code,
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
    ],
    content: content || '<p></p>',
    autofocus: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (isLinkDropdownOpen && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [isLinkDropdownOpen]);

  useEffect(() => {
    if (isImageDropdownOpen && imageInputRef.current) {
      imageInputRef.current.focus();
    }
  }, [isImageDropdownOpen]);

  useEffect(() => {
    if (isCodeDropdownOpen && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [isCodeDropdownOpen]);

  if (!editor) {
    return null;
  }

  const HEADING_OPTIONS: HeadingOption[] = [
    { level: 1 as Level, label: 'H1' },
    { level: 2 as Level, label: 'H2' },
    { level: 3 as Level, label: 'H3' },
  ];

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'Paragraph';
  };

  const currentHeading = getCurrentHeading();

  return (
    <div>
      <div className='flex space-x-2 p-2 rounded-t-md border border-neutral-300 bg-neutral-50 shadow-sm dark:border-neutral-600 dark:bg-neutral-800'>
        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700'>
              {currentHeading}
            </span>
          }
        >
          <div className='p-2'>
            {HEADING_OPTIONS.map((heading) => (
              <button
                key={heading.level}
                type='button'
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: heading.level })
                    .run()
                }
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md ${
                  editor.isActive('heading', { level: heading.level })
                    ? 'bg-neutral-200 dark:bg-neutral-700'
                    : ''
                }`}
              >
                {heading.label}
              </button>
            ))}
            <button
              type='button'
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md ${
                editor.isActive('paragraph')
                  ? 'bg-neutral-200 dark:bg-neutral-700'
                  : ''
              }`}
            >
              Paragraph
            </button>
          </div>
        </Dropdown>

        <Tooltip text='Bold' position='top'>
          <Toggle
            isActive={editor.isActive('bold')}
            onChange={() => editor.chain().focus().toggleBold().run()}
          >
            <b>B</b>
          </Toggle>
        </Tooltip>

        <Tooltip text='Italic' position='top'>
          <Toggle
            isActive={editor.isActive('italic')}
            onChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <i>I</i>
          </Toggle>
        </Tooltip>

        <Tooltip text='Underline' position='top'>
          <Toggle
            isActive={editor.isActive('underline')}
            onChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </Toggle>
        </Tooltip>

        <Tooltip text='Strikethrough' position='top'>
          <Toggle
            isActive={editor.isActive('strike')}
            onChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </Toggle>
        </Tooltip>

        <Tooltip text='Inline Code' position='top'>
          <Toggle
            isActive={editor.isActive('code')}
            onChange={() => editor.chain().focus().toggleCode().run()}
          >
            <code>{'</>'}</code>
          </Toggle>
        </Tooltip>

        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700'>
              Code Block
            </span>
          }
          onOpenChange={setIsCodeDropdownOpen}
        >
          <div className='p-2'>
            <Textarea
              ref={codeInputRef}
              placeholder='Enter your code here...'
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className='w-fit p-3 text-sm'
              rows={8}
            />
            <Button
              type='primary'
              onClick={() => {
                if (codeSnippet) {
                  editor.chain().focus().toggleCodeBlock().run();
                  editor.commands.insertContent(codeSnippet);
                  setCodeSnippet('');
                  setIsCodeDropdownOpen(false);
                }
              }}
              className='w-full'
            >
              Insert Code
            </Button>
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700'>
              Link
            </span>
          }
          onOpenChange={setIsLinkDropdownOpen}
        >
          <div className='p-2'>
            <Input
              ref={linkInputRef}
              type='text'
              placeholder='Enter URL'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className='w-fit p-3 text-sm mb-2'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && linkUrl) {
                  editor.chain().setLink({ href: linkUrl }).focus().run();
                  setLinkUrl('');
                  setIsLinkDropdownOpen(false);
                }
              }}
            />
            <Button
              type='primary'
              onClick={() => {
                if (linkUrl) {
                  editor.chain().setLink({ href: linkUrl }).focus().run();
                  setLinkUrl('');
                  setIsLinkDropdownOpen(false);
                }
              }}
              className='w-full'
            >
              Apply
            </Button>
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700'>
              Image
            </span>
          }
          onOpenChange={setIsImageDropdownOpen}
        >
          <div className='p-2'>
            <Input
              ref={imageInputRef}
              type='text'
              placeholder='Enter Image URL'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className='w-fit p-3 text-sm mb-2'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && imageUrl) {
                  editor.chain().setImage({ src: imageUrl }).focus().run();
                  setImageUrl('');
                  setIsImageDropdownOpen(false);
                }
              }}
            />
            <Button
              type='primary'
              onClick={() => {
                if (imageUrl) {
                  editor.chain().setImage({ src: imageUrl }).focus().run();
                  setImageUrl('');
                  setIsImageDropdownOpen(false);
                }
              }}
              className='w-full'
            >
              Apply
            </Button>
          </div>
        </Dropdown>
      </div>

      <div className='cursor-text border-b border-r border-l border-neutral-300 dark:border-neutral-600 rounded-b-md bg-neutral-50 dark:bg-neutral-700 h-[calc(80vh)] overflow-y-scroll'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
