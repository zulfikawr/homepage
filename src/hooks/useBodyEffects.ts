import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';

/**
 * Hook to turn on/off body scrolling
 */
const useBodyScroll = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const bodyRef = useRef<HTMLElement | null>(null);
  const [scrollable, setScrollable] = useState(true);

  useEffect(() => {
    bodyRef.current = document.body;
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;

    if (scrollable) {
      bodyRef.current.style.overflow = 'auto';
    } else {
      bodyRef.current.style.overflow = 'hidden';
    }
  }, [scrollable]);

  return [scrollable, setScrollable];
};

/**
 * Hook to set body pointerEvents to auto/none
 */
const useBodyPointerEvents = (): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const bodyRef = useRef<HTMLElement | null>(null);
  const [pointerEvents, setPointerEvents] = useState(true);

  useEffect(() => {
    bodyRef.current = document.body;
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;

    if (pointerEvents) {
      bodyRef.current.style.pointerEvents = 'auto';
    } else {
      bodyRef.current.style.pointerEvents = 'none';
    }
  }, [pointerEvents]);

  return [pointerEvents, setPointerEvents];
};

export { useBodyScroll, useBodyPointerEvents };
