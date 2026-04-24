// src/hooks/useClickOutside.js
import { useEffect } from 'react';

/**
 * Hook that handles clicks outside of a specified element
 * @param {React.RefObject} ref - Ref of the element to watch
 * @param {Function} handler - Function to call when clicking outside
 * @param {boolean} enabled - Whether the hook is enabled
 */
export const useClickOutside = (ref, handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event) => {
      // Don't do anything if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    // Use mousedown instead of click to handle cases where click starts outside
    // and ends inside (like drag operations)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
};

export default useClickOutside;