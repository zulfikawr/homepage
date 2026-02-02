'use client';

import { useEffect, useRef } from 'react';

interface UseHotkeysOptions {
  enabled?: boolean;
}

/**
 * Custom hook for handling keyboard hotkeys
 * @param keys - Hotkey(s) to listen for (e.g., 'esc', 'ctrl+k', 'command+k', 'ctrl+k, command+k')
 * @param callback - Function to execute when hotkey is pressed
 * @param options - Options object with 'enabled' property (default: true)
 */
export const useHotkeys = (
  keys: string,
  callback: (e: KeyboardEvent) => void,
  options: UseHotkeysOptions = { enabled: true },
) => {
  const { enabled = true } = options;
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // Parse hotkeys string into array of key combinations
    // e.g., 'ctrl+k, command+k' -> [['ctrl', 'k'], ['command', 'k']]
    const keyCombinations = keys.split(',').map((combo) =>
      combo
        .trim()
        .toLowerCase()
        .split('+')
        .map((key) => key.trim()),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      const pressedKey = e.key.toLowerCase();
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      const isShiftPressed = e.shiftKey;
      const isAltPressed = e.altKey;

      // Check if any key combination matches
      const isMatch = keyCombinations.some((combination) => {
        // Handle special keys
        const hasCtrl = combination.some(
          (k) => k === 'ctrl' || k === 'command',
        );
        const hasShift = combination.some((k) => k === 'shift');
        const hasAlt = combination.some((k) => k === 'alt');

        // Get the non-modifier keys
        const nonModifiers = combination.filter(
          (k) => !['ctrl', 'command', 'shift', 'alt'].includes(k),
        );

        // Check if modifier keys match
        const modifiersMatch =
          hasCtrl === isCtrlPressed &&
          hasShift === isShiftPressed &&
          hasAlt === isAltPressed;

        // Check if the actual key matches
        const keyMatch =
          nonModifiers.length === 0 ||
          nonModifiers.some((k) => {
            if (k === 'esc' || k === 'escape') return pressedKey === 'escape';
            if (k === 'enter') return pressedKey === 'enter';
            if (k === 'space') return pressedKey === ' ';
            if (k === 'tab') return pressedKey === 'tab';
            return pressedKey === k;
          });

        return modifiersMatch && keyMatch;
      });

      if (isMatch) {
        callbackRef.current(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, enabled]);
};
