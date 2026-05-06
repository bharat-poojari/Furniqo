import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('furniqo_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      const newNotification = {
        _id: `notif_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
        ...notification,
      };
      const updated = [newNotification, ...prev].slice(0, 50);
      localStorage.setItem('furniqo_notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem('furniqo_notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      localStorage.setItem('furniqo_notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n._id === notificationId);
      const updated = prev.filter(n => n._id !== notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prevUnread => Math.max(0, prevUnread - 1));
      }
      localStorage.setItem('furniqo_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('furniqo_notifications');
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};