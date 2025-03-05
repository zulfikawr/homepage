import React, { useEffect, useState } from 'react';
import Icon from '~/components/UI/Icon/icon';
import type { IconNames } from '~/components/UI/types';

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
        }, 10);
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
      }, 10);
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
  icon?: IconNames;
  bgClass: string;
  textClass: string;
  borderClass: string;
} => {
  switch (variant) {
    case 'info':
      return {
        icon: 'info',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/40',
        textClass: 'text-yellow-700 dark:text-yellow-300',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
      };
    case 'success':
      return {
        icon: 'checkCircle',
        bgClass: 'bg-blue-50 dark:bg-blue-900/40',
        textClass: 'text-blue-700 dark:text-blue-300',
        borderClass: 'border-blue-200 dark:border-blue-800',
      };
    case 'error':
      return {
        icon: 'warning',
        bgClass: 'bg-red-50 dark:bg-red-900/40',
        textClass: 'text-red-700 dark:text-red-300',
        borderClass: 'border-red-200 dark:border-red-800',
      };
    default:
      return {
        bgClass: 'bg-white dark:bg-gray-800',
        textClass: 'text-gray-800 dark:text-white',
        borderClass: 'border-gray-300 dark:border-gray-600',
      };
  }
};

const Toast = () => {
  const toasts = useToast();

  return (
    <>
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} index={index} />
      ))}
    </>
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
  const variantProps = getVariantProps(toast.variant);

  useEffect(() => {
    setIsMounted(true);

    if (toast.isRemoving) {
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [toast.isRemoving]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 top-4 lg:top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
        toast.isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
      style={{ marginTop: `${index * 50}px` }}
    >
      <div
        className={`${variantProps.bgClass} ${variantProps.textClass} border ${variantProps.borderClass} px-4 py-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer`}
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
