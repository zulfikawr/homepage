'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useBodyScroll } from 'hooks';
import { useEffectToggle } from '@/contexts/effectContext';
import { useRadius } from '@/contexts/radiusContext';

type DrawerInstance = {
  isOpen: boolean;
  content: React.ReactNode | null;
};

let drawerInstance: DrawerInstance = {
  isOpen: false,
  content: null,
};

let subscribers: ((drawer: DrawerInstance) => void)[] = [];
let pendingContent: React.ReactNode | null = null;

export const drawer = {
  open: (content: React.ReactNode) => {
    if (drawerInstance.isOpen) {
      pendingContent = content;
      drawerInstance = { ...drawerInstance, isOpen: false };
      subscribers.forEach((subscriber) => subscriber(drawerInstance));
    } else {
      drawerInstance = { isOpen: true, content };
      subscribers.forEach((subscriber) => subscriber(drawerInstance));
    }
  },
  close: () => {
    drawerInstance = { ...drawerInstance, isOpen: false };
    subscribers.forEach((subscriber) => subscriber(drawerInstance));
  },
  subscribe: (callback: (drawer: DrawerInstance) => void) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((sub) => sub !== callback);
    };
  },
};

export const useDrawer = () => {
  const [state, setState] = useState<DrawerInstance>(drawerInstance);

  useEffect(() => {
    return drawer.subscribe(setState);
  }, []);

  return state;
};

const Drawer = () => {
  const { isOpen, content } = useDrawer();
  const [animation, setAnimation] = useState<'in' | 'out'>('out');
  const [isVisible, setIsVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState<React.ReactNode | null>(
    null,
  );

  // Drag states
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [, setBodyScrollable] = useBodyScroll();
  const { effectEnabled } = useEffectToggle();
  const { radius } = useRadius();

  const handleClose = useCallback(() => {
    drawer.close();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimation('out');
      setDragY(0);
      setTimeout(() => {
        setCurrentContent(content);
        setAnimation('in');
      }, 50);
    } else {
      setAnimation('out');
      setTimeout(() => {
        setIsVisible(false);
        setCurrentContent(null);
        setDragY(0);

        if (pendingContent) {
          drawerInstance = { isOpen: true, content: pendingContent };
          pendingContent = null;
          subscribers.forEach((subscriber) => subscriber(drawerInstance));
        }
      }, 500);
    }
  }, [isOpen, content]);

  useEffect(() => {
    setBodyScrollable(!isVisible);
  }, [isVisible, setBodyScrollable]);

  useHotkeys(
    'esc',
    () => {
      handleClose();
    },
    { enabled: isVisible, enableOnTags: ['INPUT'] },
  );

  // Drag Handlers
  const onDragStart = (y: number) => {
    setIsDragging(true);
    startYRef.current = y;
  };

  const onDragMove = (y: number) => {
    if (!isDragging) return;
    const deltaY = y - startYRef.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 150) {
      handleClose();
    } else {
      setDragY(0);
    }
  };

  // Touch Events
  const handleTouchStart = (e: React.TouchEvent) => {
    onDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    onDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    onDragEnd();
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      onDragMove(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      onDragEnd();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-[9998] ${isVisible ? 'block' : 'hidden'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          animation === 'in'
            ? 'bg-opacity-50 opacity-100'
            : 'bg-opacity-50 opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`absolute bottom-0 left-0 right-0 h-[80vh] lg:h-[90vh] lg:w-page lg:mx-auto
          border-t flex flex-col overflow-hidden
          ${!isDragging ? 'transition-transform duration-500 ease-out' : ''}
          ${
            effectEnabled
              ? 'bg-white/70 dark:bg-neutral-900/70 border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
          }`}
        style={{
          borderRadius: `${radius}px ${radius}px 0 0`,
          transform: isDragging
            ? `translateY(${dragY}px)`
            : animation === 'in'
              ? 'translateY(0)'
              : 'translateY(100%)',
          touchAction: 'none',
        }}
      >
        {/* Drag Handle / Thumb */}
        <div
          className='w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing'
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className='w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full' />
        </div>

        <div className='flex-1 flex flex-col overflow-hidden'>
          {currentContent}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
