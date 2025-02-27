import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import { Level } from '@tiptap/extension-heading';
import { useEffect, useState, useRef } from 'react';
import { Dropdown } from '~/components/UI';

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
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Image,
      Strike,
    ],
    content: content,
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
      <div className='mt-4 flex space-x-2 border p-2 dark:border-gray-700 rounded-t-md'>
        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700'>
              {currentHeading}
            </span>
          }
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              editor.commands.focus();
            }
          }}
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
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                  editor.isActive('heading', { level: heading.level })
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : ''
                }`}
              >
                {heading.label}
              </button>
            ))}
            <button
              type='button'
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                editor.isActive('paragraph')
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : ''
              }`}
            >
              Paragraph
            </button>
          </div>
        </Dropdown>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-2 text-sm w-8 text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <strong>B</strong>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 text-sm w-8 text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <em>I</em>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-2 text-sm w-8 text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <u>U</u>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-2 text-sm w-8 text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <s>S</s>
        </button>

        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700'>
              Link
            </span>
          }
          onOpenChange={setIsLinkDropdownOpen}
        >
          <div className='p-2'>
            <input
              ref={linkInputRef}
              type='text'
              placeholder='Enter URL'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className='w-fit px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md mb-2 focus:outline-none'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && linkUrl) {
                  editor.chain().setLink({ href: linkUrl }).focus().run();
                  setLinkUrl('');
                  setIsLinkDropdownOpen(false);
                }
              }}
            />
            <button
              type='button'
              onClick={() => {
                if (linkUrl) {
                  editor.chain().setLink({ href: linkUrl }).focus().run();
                  setLinkUrl('');
                  setIsLinkDropdownOpen(false);
                }
              }}
              className='w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Apply
            </button>
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <span className='block cursor-pointer px-3 py-2 text-sm w-full text-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700'>
              Image
            </span>
          }
          onOpenChange={setIsImageDropdownOpen}
        >
          <div className='p-2'>
            <input
              ref={imageInputRef}
              type='text'
              placeholder='Enter Image URL'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className='w-fit px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md mb-2 focus:outline-none'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && imageUrl) {
                  editor.chain().setImage({ src: imageUrl }).focus().run();
                  setImageUrl('');
                  setIsImageDropdownOpen(false);
                }
              }}
            />
            <button
              type='button'
              onClick={() => {
                if (imageUrl) {
                  editor.chain().setImage({ src: imageUrl }).focus().run();
                  setImageUrl('');
                  setIsImageDropdownOpen(false);
                }
              }}
              className='w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Apply
            </button>
          </div>
        </Dropdown>
      </div>

      <div className='cursor-text border-b border-r border-l dark:border-gray-700 rounded-b-md'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
