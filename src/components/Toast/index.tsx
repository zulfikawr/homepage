import React, { useEffect, useState } from 'react';

// Define the ToastInstance type
type ToastInstance = {
  isVisible: boolean;
  message: string | null;
};

let toastInstance: ToastInstance = {
  isVisible: false,
  message: null,
};

let toastSubscribers: ((toast: ToastInstance) => void)[] = [];

export const toast = {
  show: (message: string) => {
    toastInstance = { isVisible: true, message };
    toastSubscribers.forEach((subscriber) => subscriber(toastInstance));

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      toastInstance = { ...toastInstance, isVisible: false };
      toastSubscribers.forEach((subscriber) => subscriber(toastInstance));
    }, 3000);
  },
  hide: () => {
    toastInstance = { ...toastInstance, isVisible: false };
    toastSubscribers.forEach((subscriber) => subscriber(toastInstance));
  },
  subscribe: (callback: (toast: ToastInstance) => void) => {
    toastSubscribers.push(callback);
    return () => {
      toastSubscribers = toastSubscribers.filter((sub) => sub !== callback);
    };
  },
};

export const useToast = () => {
  const [state, setState] = useState<ToastInstance>(toastInstance);

  useEffect(() => {
    return toast.subscribe(setState);
  }, []);

  return state;
};

const Toast = () => {
  const { isVisible, message } = useToast();
  const [isMounted, setIsMounted] = useState(false); // Track if the toast is mounted
  const [animation, setAnimation] = useState<'in' | 'out'>('out'); // Animation state

  useEffect(() => {
    if (isVisible) {
      // When the toast becomes visible, mount it and trigger the "in" animation
      setIsMounted(true);
      setTimeout(() => setAnimation('in'), 10); // Small delay to allow DOM rendering
    } else {
      // When the toast is hidden, trigger the "out" animation and unmount after the animation
      setAnimation('out');
      setTimeout(() => setIsMounted(false), 300); // Wait for the animation to complete
    }
  }, [isVisible]);

  if (!isMounted) {
    return null; // Don't render the toast if it's not mounted
  }

  return (
    <div
      className={`fixed z-50 ${
        window.innerWidth > 768
          ? 'top-4 right-4' // Desktop: top-right corner
          : 'top-4 left-1/2 transform -translate-x-1/2' // Mobile: centered top
      } transition-all duration-300 ease-in-out ${
        animation === 'in'
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className='bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center'>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
