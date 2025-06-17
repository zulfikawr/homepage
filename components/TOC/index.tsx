'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Separator from '../UI/Separator';
import { Post } from '@/types/post';

interface Heading {
  id: string;
  title: string;
  text: string;
  level: number;
  uniqueKey: string;
}

interface TOCProps {
  post: Post;
}

export default function TOC({ post }: TOCProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const seen = new Map<string, number>();
    const result: Heading[] = [];

    document
      .querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4')
      .forEach((el, index) => {
        const rawId = el.id || `heading-${index}`;
        const count = seen.get(rawId) || 0;
        const uniqueId = count === 0 ? rawId : `${rawId}-${count}`;
        seen.set(rawId, count + 1);

        result.push({
          id: el.id,
          title: post.title,
          text: el.textContent || `Untitled ${index}`,
          level: Number(el.tagName[1]),
          uniqueKey: uniqueId,
        });
      });

    setHeadings(result);
  }, [pathname, post.title]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 130;
      const scrollY = window.scrollY;

      const visibleHeading = headings.findLast((heading) => {
        const el = document.getElementById(heading.id);
        if (!el) return false;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return scrollY >= top - offset;
      });

      setActiveId(visibleHeading?.id || null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className='w-[14rem] sticky top-24 self-start'>
      <Card isInForm className='p-4'>
        <p className='text-sm font-semibold'>{post.title}</p>
        <Separator margin='2' />
        <ul className='space-y-2 text-sm'>
          {headings.map(({ id, text, level, uniqueKey }) => (
            <li
              key={uniqueKey}
              style={{ paddingLeft: `${(level - 1) * 12}px` }}
            >
              <Link
                href={`#${id}`}
                className={`block transition-colors ${
                  activeId === id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
