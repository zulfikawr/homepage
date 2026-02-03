'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';

import { renderMarkdown } from '@/utilities/render-markdown';

import { Badge, BadgeProps } from '../badge';
import { Button, ButtonProps } from '../button';
import { drawer } from '../drawer';
import { Icon, IconName } from '../icon';
import { Label, LabelProps } from '../label';
import { toast } from '../toast';
import { Tooltip } from '../tooltip';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface HydratableElement extends HTMLElement {
  _reactRoot?: Root;
}

const CopyButton = ({ code }: { code: string }) => {
  const [label, setLabel] = useState('Copy');

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setLabel('Copied!');
      toast.show('Copied to clipboard');
      setTimeout(() => setLabel('Copy'), 2000);
    } catch {
      toast.show('Failed to copy');
    }
  };

  return (
    <Button
      variant='outline'
      icon='copy'
      className='h-7 text-xs px-2 [&_svg]:!w-3.5 [&_svg]:!h-3.5'
      onClick={handleCopy}
    >
      {label}
    </Button>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = 'prose dark:prose-invert max-w-none',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const localRootsMapRef = useRef<Map<HTMLElement, Root>>(new Map());
  const [copyPortals, setCopyPortals] = useState<
    { container: Element; code: string }[]
  >([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeElements = new Set<HTMLElement>();

    const hydrateElement = (el: HTMLElement, component: React.ReactElement) => {
      const hydratableEl = el as HydratableElement;
      let root = hydratableEl._reactRoot;

      if (!root) {
        root = createRoot(hydratableEl);
        hydratableEl._reactRoot = root;
      }

      root.render(component);
      localRootsMapRef.current.set(hydratableEl, root);
      activeElements.add(hydratableEl);
    };

    // Hydrate Tooltips
    container
      .querySelectorAll<HTMLElement>('.markdown-ui-tooltip')
      .forEach((el) => {
        const text = el.getAttribute('data-ui-text') || '';
        const label = el.textContent || '';
        hydrateElement(el, <Tooltip text={text}>{label}</Tooltip>);
      });

    // Hydrate Badges
    container
      .querySelectorAll<HTMLElement>('.markdown-ui-badge')
      .forEach((el) => {
        const variant = (el.getAttribute('data-ui-variant') ||
          'default') as BadgeProps['variant'];
        const icon = el.getAttribute('data-ui-icon') as IconName;
        const label = el.textContent || '';
        hydrateElement(
          el,
          <Badge variant={variant} icon={icon}>
            {label}
          </Badge>,
        );
      });

    // Hydrate Labels
    container
      .querySelectorAll<HTMLElement>('.markdown-ui-label')
      .forEach((el) => {
        const variant = (el.getAttribute('data-ui-variant') ||
          'primary') as LabelProps['variant'];
        const icon = el.getAttribute('data-ui-icon') as IconName;
        const label = el.textContent || '';
        hydrateElement(
          el,
          <Label variant={variant} icon={icon}>
            {label}
          </Label>,
        );
      });

    // Hydrate Icons
    container
      .querySelectorAll<HTMLElement>('.markdown-ui-icon')
      .forEach((el) => {
        const name = el.getAttribute('data-ui-name') as IconName;
        const size = el.getAttribute('data-ui-size') || '20';
        hydrateElement(el, <Icon name={name} size={size} />);
      });

    // Hydrate Generic Buttons
    container
      .querySelectorAll<HTMLElement>('.markdown-ui-button-component')
      .forEach((el) => {
        const variant = (el.getAttribute('data-ui-variant') ||
          'default') as ButtonProps['variant'];
        const icon = el.getAttribute('data-ui-icon') as IconName;
        const label = el.textContent || '';
        const className = el.getAttribute('class') || '';
        hydrateElement(
          el,
          <Button variant={variant} icon={icon} className={className}>
            {label}
          </Button>,
        );
      });

    // Cleanup roots that are no longer active in this render
    const rootsToCleanup: [HydratableElement, Root][] = [];
    localRootsMapRef.current.forEach((root, el) => {
      if (!activeElements.has(el)) {
        rootsToCleanup.push([el as HydratableElement, root]);
      }
    });

    if (rootsToCleanup.length > 0) {
      setTimeout(() => {
        rootsToCleanup.forEach(([el, root]) => {
          try {
            if (!container.contains(el)) {
              root.unmount();
              delete el._reactRoot;
              localRootsMapRef.current.delete(el);
            }
          } catch (error) {
            console.error('Failed to unmount root:', error);
          }
        });
      }, 0);
    }

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
    };
  }, [content]);

  // Separate effect for portal state updates to avoid synchronous setState warnings
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find Copy Button Containers for Portals
    const portals: { container: Element; code: string }[] = [];
    container.querySelectorAll('.code-copy-btn-wrapper').forEach((el) => {
      const code = decodeURIComponent(el.getAttribute('data-code') || '');
      // Clear the "Wait..." text before mounting
      el.innerHTML = '';
      portals.push({ container: el, code });
    });

    // Defer state update to avoid synchronous setState warning
    setTimeout(() => {
      setCopyPortals(portals);
    }, 0);
  }, [content]);

  // Final cleanup on component unmount
  useEffect(() => {
    const currentRoots = localRootsMapRef.current;
    return () => {
      const allRoots = Array.from(currentRoots.entries());
      currentRoots.clear();
      setTimeout(() => {
        allRoots.forEach(([el, root]) => {
          try {
            root.unmount();
            const hydratableEl = el as HydratableElement;
            delete hydratableEl._reactRoot;
          } catch (error) {
            console.error('Failed to unmount root:', error);
          }
        });
      }, 0);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
      {copyPortals.map((portal, index) =>
        createPortal(
          <CopyButton key={index} code={portal.code} />,
          portal.container,
        ),
      )}
    </>
  );
};
