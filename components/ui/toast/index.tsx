'use client';

import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconName } from '@/components/ui/icon';
import { Portal } from '@/components/ui/portal';

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
        bgClass: 'bg-theme-yellow',
        textClass: 'text-theme-bg',
        borderClass: 'border-theme-bg',
      };
    case 'success':
      return {
        icon: 'checkCircle',
        bgClass: 'bg-theme-blue',
        textClass: 'text-theme-bg',
        borderClass: 'border-theme-bg',
      };
    case 'error':
      return {
        icon: 'warning',
        bgClass: 'bg-theme-red',
        textClass: 'text-theme-bg',
        borderClass: 'border-theme-bg',
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
      className={twMerge(
        'fixed top-8 lg:top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out pointer-events-auto',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8',
      )}
      style={{ marginTop: `${index * 60}px` }}
    >
      <div
        className={twMerge(
          variantProps.bgClass,
          '${variantProps.textClass} border-2 ${variantProps.borderClass} px-4 py-2 rounded-lg shadow-brutalist-lg flex items-center justify-center cursor-pointer text-sm md:text-md lg:text-lg whitespace-nowrap transition-all duration-150 hover:shadow-brutalist-xl hover:-translate-y-1',
        )}
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
