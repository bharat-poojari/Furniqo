// src/hooks/useKeyboardNavigation.js
import { useEffect } from 'react';

/**
 * Hook for handling keyboard navigation events
 * @param {Object} options - Configuration options
 * @param {Function} options.onArrowUp - Callback for ArrowUp key
 * @param {Function} options.onArrowDown - Callback for ArrowDown key
 * @param {Function} options.onArrowLeft - Callback for ArrowLeft key
 * @param {Function} options.onArrowRight - Callback for ArrowRight key
 * @param {Function} options.onEnter - Callback for Enter key
 * @param {Function} options.onEscape - Callback for Escape key
 * @param {Function} options.onSpace - Callback for Space key
 * @param {Function} options.onTab - Callback for Tab key
 * @param {Array} options.hotkeys - Array of hotkey combinations (e.g., ['Ctrl+K', 'Meta+K'])
 * @param {boolean} options.enabled - Whether the hook is enabled
 * @param {HTMLElement} options.targetElement - Target element to attach listeners to (default: window)
 */
export const useKeyboardNavigation = (options) => {
  const {
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onTab,
    hotkeys = [],
    enabled = true,
    targetElement = typeof window !== 'undefined' ? window : null,
  } = options;

  useEffect(() => {
    if (!enabled || !targetElement) return;

    const handleKeyDown = (e) => {
      // Handle arrow keys
      switch (e.key) {
        case 'ArrowUp':
          onArrowUp?.(e);
          break;
        case 'ArrowDown':
          onArrowDown?.(e);
          break;
        case 'ArrowLeft':
          onArrowLeft?.(e);
          break;
        case 'ArrowRight':
          onArrowRight?.(e);
          break;
        case 'Enter':
          onEnter?.(e);
          break;
        case 'Escape':
          onEscape?.(e);
          break;
        case ' ':
        case 'Space':
          onSpace?.(e);
          break;
        case 'Tab':
          onTab?.(e);
          break;
        default:
          break;
      }

      // Handle hotkey combinations
      if (hotkeys.length > 0) {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        
        hotkeys.forEach((hotkey) => {
          const keys = hotkey.toLowerCase().split('+');
          const hasCtrl = keys.includes('ctrl') || keys.includes('cmd');
          const hasShift = keys.includes('shift');
          const hasAlt = keys.includes('alt');
          const key = keys[keys.length - 1];
          
          const matchesCtrl = hasCtrl ? isCtrlOrCmd : !isCtrlOrCmd;
          const matchesShift = hasShift ? e.shiftKey : !e.shiftKey;
          const matchesAlt = hasAlt ? e.altKey : !e.altKey;
          const matchesKey = e.key.toLowerCase() === key;
          
          if (matchesCtrl && matchesShift && matchesAlt && matchesKey) {
            e.preventDefault();
            // Find the corresponding callback
            const callbackName = `on${hotkey.replace(/[^a-zA-Z]/g, '')}`;
            const callback = options[callbackName];
            if (callback) callback(e);
          }
        });
      }
    };

    targetElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onTab,
    hotkeys,
    enabled,
    targetElement,
    options,
  ]);
};

export default useKeyboardNavigation;