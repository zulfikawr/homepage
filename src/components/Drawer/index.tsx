import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useBodyScroll } from '~/hooks';

// Define the DrawerInstance type
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
    <div className={`fixed inset-0 z-50 ${isVisible ? 'block' : 'hidden'}`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          animation === 'in'
            ? 'bg-opacity-50 opacity-100'
            : 'bg-opacity-50 opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 h-[75vh] md:h-[90vh] md:w-page md:mx-auto 
          bg-white dark:bg-gray-800 rounded-t-xl border-t dark:border-gray-700 
          shadow-md flex flex-col transition-transform duration-500 ease-in-out
          ${animation === 'in' ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {currentContent}
      </div>
    </div>
  );
};

export default Drawer;
