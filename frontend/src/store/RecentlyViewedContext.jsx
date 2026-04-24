import { createContext, useState, useEffect, useCallback, useContext } from 'react';

export const RecentlyViewedContext = createContext(null);

const MAX_ITEMS = 12;

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const saved = localStorage.getItem('furniqo_recently_viewed');
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      setRecentlyViewed([]);
    }
  };

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item._id !== product._id);
      
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      
      // Save to localStorage
      localStorage.setItem('furniqo_recently_viewed', JSON.stringify(updated));
      
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('furniqo_recently_viewed');
  }, []);

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};