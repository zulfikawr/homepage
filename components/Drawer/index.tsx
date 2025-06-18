'use client';

import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useBodyScroll } from 'hooks';
import { useEffectToggle } from '@/contexts/effectContext';

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
  const [, setBodyScrollable] = useBodyScroll();
  const { effectEnabled } = useEffectToggle();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimation('out');
      setTimeout(() => {
        setCurrentContent(content);
        setAnimation('in');
      }, 50);
    } else {
      setAnimation('out');
      setTimeout(() => {
        setIsVisible(false);
        setCurrentContent(null);

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

  const handleClose = () => {
    drawer.close();
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
        className={`absolute bottom-0 left-0 right-0 h-[80vh] lg:h-[90vh] lg:w-page lg:mx-auto
          rounded-t-2xl border-t-xl flex flex-col transition-transform duration-500 ease-in-out
          ${animation === 'in' ? 'translate-y-0' : 'translate-y-full'}
          ${
            effectEnabled
              ? 'bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 backdrop-blur-md shadow-md'
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
          }`}
      >
        {currentContent}
      </div>
    </div>
  );
};

export default Drawer;
