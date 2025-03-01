import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useBodyScroll } from '~/hooks';

// Define the ModalInstance type
type ModalInstance = {
  isOpen: boolean;
  content: React.ReactNode | null;
};

let modalInstance: ModalInstance = {
  isOpen: false,
  content: null,
};

let subscribers: ((modal: ModalInstance) => void)[] = [];
let pendingContent: React.ReactNode | null = null;

export const modal = {
  open: (content: React.ReactNode) => {
    if (modalInstance.isOpen) {
      // Queue the new content and close the current modal
      pendingContent = content;
      modalInstance = { ...modalInstance, isOpen: false };
      subscribers.forEach((subscriber) => subscriber(modalInstance));
    } else {
      // Open the modal immediately if it's not already open
      modalInstance = { isOpen: true, content };
      subscribers.forEach((subscriber) => subscriber(modalInstance));
    }
  },
  close: () => {
    modalInstance = { ...modalInstance, isOpen: false };
    subscribers.forEach((subscriber) => subscriber(modalInstance));
  },
  subscribe: (callback: (modal: ModalInstance) => void) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((sub) => sub !== callback);
    };
  },
};

export const useModal = () => {
  const [state, setState] = useState<ModalInstance>(modalInstance);

  useEffect(() => {
    return modal.subscribe(setState);
  }, []);

  return state;
};

const Modal = () => {
  const { isOpen, content } = useModal();
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
          modalInstance = { isOpen: true, content: pendingContent };
          pendingContent = null;
          subscribers.forEach((subscriber) => subscriber(modalInstance));
        }
      }, 400);
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
    modal.close();
  };

  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 ${isVisible ? 'block' : 'hidden'}`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-400 ${
          animation === 'in'
            ? 'bg-opacity-50 opacity-100'
            : 'bg-opacity-50 opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 
          shadow-md flex flex-col transition-all duration-400 ease-in-out
          ${animation === 'in' ? 'scale-100' : 'scale-95'} ${
            animation === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {currentContent}
      </div>
    </div>
  );
};

export default Modal;
