import type { TabsProps } from '.';
import TabItemComponent from './item';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useMouseLeaveListener } from '~/hooks';
import scrollToItemWithinDiv from '~/utilities/scrollTo';

const Tabs = (props: TabsProps) => {
  const { items, direction, defaultHighlighted, verticalListWrapper } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [withinWrapper, setWithinWrapper] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  /**
   * Remove the highlighter
   */
  const reset = (skipVertical?: boolean) => {
    if (skipVertical && direction === 'vertical') return;
    setWithinWrapper(false);
    styleHighlighter(false);
    setHighlightedIndex(-1);
  };

  /* Highlighting Methods */

  const findNextValidTabIndex = (
    currentIndex: number,
    direction: 'up' | 'down',
  ): number => {
    let targetIndex =
      direction === 'down'
        ? currentIndex + 1 < items.length
          ? currentIndex + 1
          : 0
        : currentIndex - 1 >= 0
          ? currentIndex - 1
          : items.length - 1;

    return targetIndex;
  };

  const styleHighlighter = (
    visible: boolean,
    wrapperBoundingBox?: DOMRect | null,
    tabBoundingBox?: DOMRect | null,
    bgColor?: string,
    bgDark?: string,
    className?: string,
  ) => {
    if (!highlighterRef.current) return;

    highlighterRef.current.style.transitionDuration =
      visible && (withinWrapper || highlightedIndex > 0) ? '150ms' : '0ms';
    highlighterRef.current.style.opacity = visible ? '1' : '0';

    if (visible) {
      highlighterRef.current.style.width = `${tabBoundingBox.width}px`;
      highlighterRef.current.style.height = `${tabBoundingBox.height}px`;

      highlighterRef.current.style.transform =
        direction === 'vertical'
          ? `translateY(${tabBoundingBox.top - wrapperBoundingBox.top}px)`
          : `translateX(${tabBoundingBox.left - wrapperBoundingBox.left}px)`;

      highlighterRef.current.className = [
        'tabs-highlighter z-0',
        className || '',
        bgColor || 'bg-menu',
        bgDark || 'dark:bg-gray-700/40 backdrop-blur-sm',
      ].join(' ');
    } else {
      highlighterRef.current.style.width = '0';
      highlighterRef.current.style.height = '0';
      highlighterRef.current.style.transform = 'none';
      highlighterRef.current.className = '';
    }
  };

  const highlight = (
    e: React.MouseEvent<HTMLElement> | Element,
    bgColor?: string,
    bgDark?: string,
    className?: string,
    index?: number,
    from?: 'above' | 'below',
  ) => {
    if (items[index]?.hoverable === false && e instanceof Element) {
      const targetIndex =
        from === 'below'
          ? index - 1 >= 0
            ? index - 1
            : items.length - 1
          : index + 1 < items.length
            ? index + 1
            : 0;
      if (targetIndex >= 0 && targetIndex < items.length) {
        highlight(
          listRef.current.children[targetIndex],
          items[targetIndex].bgColor,
          items[targetIndex].bgDark,
          className,
          targetIndex,
          from,
        );
      }
      return;
    }

    if (verticalListWrapper) {
      scrollToItemWithinDiv(
        verticalListWrapper.current,
        listRef.current.children[index],
      );
    }

    const targetTabBoundingBox =
      e instanceof Element
        ? e.getBoundingClientRect()
        : e.currentTarget.getBoundingClientRect();
    const wrapperBoundingBox = wrapperRef.current?.getBoundingClientRect();
    styleHighlighter(
      true,
      wrapperBoundingBox,
      targetTabBoundingBox,
      bgColor,
      bgDark,
      className,
    );
    setWithinWrapper(true);
    index >= 0 && setHighlightedIndex(index);
  };

  const highlightFirstItem = (delay: number) => {
    setTimeout(() => {
      if (!listRef.current) return;
      if (items[0] && direction === 'vertical' && defaultHighlighted) {
        highlight(
          listRef.current.children[0],
          items[0].bgColor,
          items[0].bgDark,
          delay === 0 ? '' : 'animate-kbarHighlighter',
          0,
          'above',
        );
      } else {
        reset();
      }
    }, delay);
  };

  /* Vertical List Methods */
  if (direction === 'vertical') {
    useHotkeys(
      'down',
      (e) => {
        e.preventDefault();
        const targetIndex = findNextValidTabIndex(highlightedIndex, 'down');
        highlight(
          listRef.current.children[targetIndex],
          items[targetIndex].bgColor,
          items[targetIndex].bgDark,
          '',
          targetIndex,
          'above',
        );
      },
      {
        enableOnTags: ['INPUT'],
      },
      [highlightedIndex],
    );
    useHotkeys(
      'up',
      (e) => {
        e.preventDefault();
        const targetIndex = findNextValidTabIndex(highlightedIndex, 'up');
        highlight(
          listRef.current.children[targetIndex],
          items[targetIndex].bgColor,
          items[targetIndex].bgDark,
          '',
          targetIndex,
          'below',
        );
      },
      {
        enableOnTags: ['INPUT'],
      },
      [highlightedIndex],
    );
    useHotkeys(
      'enter',
      (e) => {
        e.preventDefault();
        items[highlightedIndex].onClick !== null &&
          items[highlightedIndex].onClick();
      },
      {
        enableOnTags: ['INPUT'],
      },
      [highlightedIndex],
    );
  }

  useEffect(() => {
    if (direction !== 'vertical') return;
    if (!listRef.current || !verticalListWrapper.current) return;
    const listHeight = listRef.current.getBoundingClientRect().height;
    verticalListWrapper.current.style.height = `${listHeight >= 340 ? 360 : listHeight + 20}px`;
  }, [direction, defaultHighlighted, verticalListWrapper, listRef, items]);

  useEffect(() => {
    if (!listRef.current) return;
    const listHeight = listRef.current.getBoundingClientRect().height;
    const delay = listHeight <= 340 ? 0 : 100;
    highlightFirstItem(highlightedIndex <= 0 ? delay : 0);
  }, [defaultHighlighted, items, listRef]);

  useMouseLeaveListener(() => {
    reset(true);
  });

  return (
    <div
      ref={wrapperRef}
      className={`relative ${direction !== 'vertical' && 'tabs-wrapper'}`}
      onMouseLeave={() => {
        reset(true);
      }}
    >
      <div ref={highlighterRef} className='tabs-highlighter z-0' />
      <ul
        data-cy='tabs-list'
        className={`list-none items-center ${
          direction === 'vertical'
            ? 'grid grid-flow-row'
            : 'flex flex-row gap-x-2'
        }`}
        ref={listRef}
      >
        {items.map((item, index) => {
          const { className, bgColor, bgDark, color, onClick } = item;
          return (
            <React.Fragment key={item.label}>
              <li
                aria-label='tab'
                className={`${direction !== 'vertical' && 'whitespace-nowrap'} ${
                  color ||
                  'text-gray-500 dark:text-gray-400 dark:transition-colors'
                } ${className || ''} z-10 cursor-pointer rounded-md`}
                onMouseOver={(e) => {
                  if (item.hoverable !== false) {
                    highlight(e, bgColor, bgDark, '', index);
                  } else if (direction !== 'vertical') {
                    reset();
                  }
                }}
                onClick={onClick}
              >
                <>
                  {item.component || (
                    <TabItemComponent
                      {...item}
                      key={item.label}
                      index={index}
                    />
                  )}
                </>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
