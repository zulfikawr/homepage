'use client';

import React, { useEffect, useState } from 'react';

import { useBodyScroll, useHotkeys } from '@/hooks';

import { Portal } from '../Portal';

type ModalInstance = {
  isOpen: boolean;
  content: React.ReactNode | null;
};

let modalInstance: ModalInstance = {
  isOpen: false,
  content: null,
};

let subscribers: ((modal: ModalInstance) => void)[] = [];

export const modal = {
  open: (content: React.ReactNode) => {
    if (modalInstance.isOpen) {
      modalInstance = { ...modalInstance, isOpen: false };
      subscribers.forEach((subscriber) => subscriber(modalInstance));
    } else {
      modalInstance = { isOpen: true, content };
      subscribers.forEach((subscriber) => subscriber(modalInstance));
    }
  },
  update: (content: React.ReactNode) => {
    modalInstance = { ...modalInstance, content };
    subscribers.forEach((subscriber) => subscriber(modalInstance));
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
      requestAnimationFrame(() => {
        setIsVisible(true);
        setAnimation('out');
      });
      setTimeout(() => {
        setCurrentContent(content);
        setAnimation('in');
      }, 50);
    } else {
      requestAnimationFrame(() => {
        setAnimation('out');
      });
      setTimeout(() => {
        setIsVisible(false);
        setCurrentContent(null);
      }, 400);
    }
  }, [isOpen, content]);

  useEffect(() => {
    setBodyScrollable(!isVisible);
  }, [isVisible, setBodyScrollable]);

  const handleClose = () => {
    modal.close();
  };

  useHotkeys(
    'esc',
    () => {
      handleClose();
    },
    { enabled: isVisible },
  );

  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9999] ${isVisible ? 'block' : 'hidden'}`}
      >
        <div
          className={`absolute inset-0 bg-card/60 backdrop-blur-xs transition-opacity duration-500 ${
            animation === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <div
            className={`w-full max-w-xl bg-card rounded-xl border  
          shadow-md flex flex-col transition-all duration-400 ease-in-out
          ${animation === 'in' ? 'scale-100' : 'scale-95'} ${
            animation === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
          >
            {currentContent}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
