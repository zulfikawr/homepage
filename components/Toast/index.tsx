'use client';

import React, { useEffect, useState } from 'react';

import { Portal } from '@/components/UI';
import { Icon, IconName } from '@/components/UI/Icon';

type ToastVariant = 'default' | 'info' | 'success' | 'error';

type ToastInstance = {
  id: number;
  message: string;
  isVisible: boolean;
  isRemoving: boolean;
  variant: ToastVariant;
};

let toastInstances: ToastInstance[] = [];
let toastSubscribers: ((toasts: ToastInstance[]) => void)[] = [];
let toastIdCounter = 0;

export const toast = {
  show: (message: string, variant: ToastVariant = 'default') => {
    const newToast: ToastInstance = {
      id: toastIdCounter++,
      message,
      isVisible: false,
      isRemoving: false,
      variant,
    };

    if (toastInstances.length >= 3) {
      const oldestToast = toastInstances[0];
      oldestToast.isVisible = false;
      oldestToast.isRemoving = true;
      toastSubscribers.forEach((subscriber) => subscriber([...toastInstances]));

      setTimeout(() => {
        toastInstances = toastInstances.filter((t) => t.id !== oldestToast.id);
        toastInstances.push(newToast);
        toastSubscribers.forEach((subscriber) =>
          subscriber([...toastInstances]),
        );

        setTimeout(() => {
          const addedToast = toastInstances.find((t) => t.id === newToast.id);
          if (addedToast) {
            addedToast.isVisible = true;
            toastSubscribers.forEach((subscriber) =>
              subscriber([...toastInstances]),
            );
          }
        }, 50);
      }, 300);
    } else {
      toastInstances.push(newToast);
      toastSubscribers.forEach((subscriber) => subscriber([...toastInstances]));

      setTimeout(() => {
        const addedToast = toastInstances.find((t) => t.id === newToast.id);
        if (addedToast) {
          addedToast.isVisible = true;
          toastSubscribers.forEach((subscriber) =>
            subscriber([...toastInstances]),
          );
        }
      }, 50);
    }

    setTimeout(() => {
      const toastToHide = toastInstances.find((t) => t.id === newToast.id);
      if (toastToHide) {
        toastToHide.isVisible = false;
        toastToHide.isRemoving = true;
        toastSubscribers.forEach((subscriber) =>
          subscriber([...toastInstances]),
        );

        setTimeout(() => {
          toastInstances = toastInstances.filter((t) => t.id !== newToast.id);
          toastSubscribers.forEach((subscriber) =>
            subscriber([...toastInstances]),
          );
        }, 300);
      }
    }, 3000);
  },
  info: (message: string) => {
    toast.show(message, 'info');
  },
  success: (message: string) => {
    toast.show(message, 'success');
  },
  error: (message: string) => {
    toast.show(message, 'error');
  },
  hide: (id: number) => {
    const toastToHide = toastInstances.find((t) => t.id === id);
    if (toastToHide) {
      toastToHide.isVisible = false;
      toastToHide.isRemoving = true;
      toastSubscribers.forEach((subscriber) => subscriber([...toastInstances]));

      setTimeout(() => {
        toastInstances = toastInstances.filter((t) => t.id !== id);
        toastSubscribers.forEach((subscriber) =>
          subscriber([...toastInstances]),
        );
      }, 300);
    }
  },
  subscribe: (callback: (toasts: ToastInstance[]) => void) => {
    toastSubscribers.push(callback);
    callback([...toastInstances]);
    return () => {
      toastSubscribers = toastSubscribers.filter((sub) => sub !== callback);
    };
  },
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return toasts;
};

const getVariantProps = (
  variant: ToastVariant,
): {
  icon?: IconName;
  bgClass: string;
  textClass: string;
  borderClass: string;
} => {
  switch (variant) {
    case 'info':
      return {
        icon: 'info',
        bgClass: 'bg-gruv-yellow/20 dark:bg-gruv-yellow/40',
        textClass: 'text-gruv-yellow dark:text-gruv-yellow',
        borderClass: 'border-gruv-yellow/30 dark:border-gruv-yellow/50',
      };
    case 'success':
      return {
        icon: 'checkCircle',
        bgClass: 'bg-gruv-blue/20 dark:bg-gruv-blue/40',
        textClass: 'text-gruv-blue dark:text-gruv-blue',
        borderClass: 'border-gruv-blue/30 dark:border-gruv-blue/50',
      };
    case 'error':
      return {
        icon: 'warning',
        bgClass: 'bg-gruv-red/20 dark:bg-gruv-red/40',
        textClass: 'text-gruv-red dark:text-gruv-red',
        borderClass: 'border-gruv-red/30 dark:border-gruv-red/50',
      };
    default:
      return {
        bgClass: 'bg-card',
        textClass: 'text-foreground',
        borderClass: 'border',
      };
  }
};

const Toast = () => {
  const toasts = useToast();

  if (toasts.length === 0) return null;

  return (
    <Portal>
      <div className='fixed inset-0 pointer-events-none z-[10001]'>
        {toasts.map((toast, index) => (
          <ToastItem key={toast.id} toast={toast} index={index} />
        ))}
      </div>
    </Portal>
  );
};

const ToastItem = ({
  toast,
  index,
}: {
  toast: ToastInstance;
  index: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const variantProps = getVariantProps(toast.variant);

  useEffect(() => {
    const mountTimeout = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const visibilityTimeout = setTimeout(() => {
      setIsVisible(toast.isVisible);
    }, 50);

    if (toast.isRemoving) {
      const removalTimeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);

      return () => {
        clearTimeout(mountTimeout);
        clearTimeout(visibilityTimeout);
        clearTimeout(removalTimeout);
      };
    }

    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(visibilityTimeout);
    };
  }, [toast.isVisible, toast.isRemoving]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed top-8 lg:top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out pointer-events-auto ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
      style={{ marginTop: `${index * 60}px` }}
    >
      <div
        className={`${variantProps.bgClass} ${variantProps.textClass} border ${variantProps.borderClass} px-4 py-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer text-sm lg:text-lg whitespace-nowrap`}
      >
        {variantProps.icon && (
          <span className='mr-2 size-5'>
            <Icon name={variantProps.icon} />
          </span>
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
