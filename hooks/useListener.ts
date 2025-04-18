'use client';

import { useEffect, useState } from 'react';

type MouseEventHandler = (event: MouseEvent) => void;

/**
 * Hook to add a listener for mouseLeave event
 */
export const useMouseLeaveListener = (
  eventHandler: MouseEventHandler,
  element?: HTMLElement | Document,
) => {
  const type = 'mouseleave';
  const handler: MouseEventHandler = (event) => {
    if (
      event.clientY <= 0 ||
      event.clientX <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight
    ) {
      eventHandler(event);
    }
  };
  return useListener(type, handler, element);
};

/**
 * Hook to add a listener for a DOM event
 */
const useListener = (
  type: string,
  listener: (event: Event) => void,
  element?: HTMLElement | Document,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [listening, setListening] = useState(true);

  useEffect(() => {
    const domElement = element || document;
    domElement.addEventListener(type, listener);

    return () => {
      domElement.removeEventListener(type, listener);
    };
  }, [listening, element, listener, type]);

  return [listening, setListening];
};

export default useListener;
