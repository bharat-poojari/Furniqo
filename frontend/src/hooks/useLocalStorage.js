import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    try {
      const item = localStorage.getItem(key);
      let parsedItem;
      
      if (item !== null) {
        parsedItem = JSON.parse(item);
        setStoredValue(parsedItem);
      } else if (initialValue !== undefined) {
        // Initialize localStorage with initialValue if empty
        const initialValueToStore = initialValue instanceof Function 
          ? initialValue() 
          : initialValue;
        localStorage.setItem(key, JSON.stringify(initialValueToStore));
        setStoredValue(initialValueToStore);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
    setIsLoaded(true);
  }, [key]); // Remove initialValue from deps to avoid re-runs

  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') return;
    
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isLoaded];
};