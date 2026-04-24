import { useState, useEffect } from 'react';
import { throttle } from '../utils/helpers';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = throttle(() => {
      const currentScrollY = window.pageYOffset;
      
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setScrollPosition(currentScrollY);
      
      lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollPosition, scrollDirection };
};