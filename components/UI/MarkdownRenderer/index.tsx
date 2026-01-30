'use client';

import React, { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { renderMarkdown } from '@/utilities/renderMarkdown';

import { Badge, BadgeProps } from '../Badge';
import { drawer } from '../Drawer';
import { Icon, IconName } from '../Icon';
import { Label, LabelProps } from '../Label';
import { toast } from '../Toast';
import { Tooltip } from '../Tooltip';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = 'prose dark:prose-invert max-w-none',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Root[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cleanup previous roots
    rootsRef.current.forEach((root) => root.unmount());
    rootsRef.current = [];

    // Hydrate Tooltips
    container.querySelectorAll('.markdown-ui-tooltip').forEach((el) => {
      const text = el.getAttribute('data-ui-text') || '';
      const label = el.textContent || '';
      const root = createRoot(el);
      root.render(<Tooltip text={text}>{label}</Tooltip>);
      rootsRef.current.push(root);
    });

    // Hydrate Badges
    container.querySelectorAll('.markdown-ui-badge').forEach((el) => {
      const variant = (el.getAttribute('data-ui-variant') ||
        'default') as BadgeProps['variant'];
      const icon = el.getAttribute('data-ui-icon') as IconName;
      const label = el.textContent || '';
      const root = createRoot(el);
      root.render(
        <Badge variant={variant} icon={icon}>
          {label}
        </Badge>,
      );
      rootsRef.current.push(root);
    });

    // Hydrate Labels
    container.querySelectorAll('.markdown-ui-label').forEach((el) => {
      const variant = (el.getAttribute('data-ui-variant') ||
        'primary') as LabelProps['variant'];
      const icon = el.getAttribute('data-ui-icon') as IconName;
      const label = el.textContent || '';
      const root = createRoot(el);
      root.render(
        <Label variant={variant} icon={icon}>
          {label}
        </Label>,
      );
      rootsRef.current.push(root);
    });

    // Hydrate Icons
    container.querySelectorAll('.markdown-ui-icon').forEach((el) => {
      const name = el.getAttribute('data-ui-name') as IconName;
      const size = el.getAttribute('data-ui-size') || '20';
      const root = createRoot(el);
      root.render(<Icon name={name} size={size} />);
      rootsRef.current.push(root);
    });

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.markdown-ui-btn') as HTMLElement;
      if (!btn) return;

      const type = btn.getAttribute('data-ui-type');
      const value = btn.getAttribute('data-ui-value');

      if (type === 'toast') {
        toast.show(value || 'Success!');
      } else if (type === 'drawer') {
        drawer.open(
          <div className='p-8 flex flex-col h-full overflow-y-auto'>
            <div className='prose dark:prose-invert max-w-none'>
              <MarkdownRenderer content={value || ''} />
            </div>
          </div>,
        );
      }
    };

    container.addEventListener('click', handleClick);
    return () => {
      container.removeEventListener('click', handleClick);

      rootsRef.current.forEach((root) => root.unmount());
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};
