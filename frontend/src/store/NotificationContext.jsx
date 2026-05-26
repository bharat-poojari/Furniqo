import { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();
  // Toast management: dedupe messages and limit concurrent toasts
  const activeToastsRef = useRef([]); // array of { id, message }
  const toastMapRef = useRef(new Map()); // message => id

  // Preserve original toast methods so we can call them from the manager
  const originalsRef = useRef({
    success: toast.success.bind(toast),
    error: toast.error.bind(toast),
    main: toast.bind ? toast.bind(toast) : (m, o) => toast(m, o),
    dismiss: toast.dismiss.bind(toast),
  });

  // Central managed toast
  const showManagedToast = useCallback((message, type = 'success', options = {}) => {
    if (!message) return;

    // If same message already displayed, skip duplicate
    if (toastMapRef.current.has(message)) return;

    // Keep at most 2 active toasts by dismissing the oldest
    if (activeToastsRef.current.length >= 2) {
      const oldest = activeToastsRef.current.shift();
      if (oldest && oldest.id) originalsRef.current.dismiss(oldest.id);
      if (oldest && oldest.message) toastMapRef.current.delete(oldest.message);
    }

    let id;
    const mergedOptions = {
      duration: 3000,
      ...options,
      onClose: () => {
        // cleanup
        toastMapRef.current.delete(message);
        activeToastsRef.current = activeToastsRef.current.filter(t => t.id !== id);
        if (options && typeof options.onClose === 'function') options.onClose();
      }
    };

    if (type === 'success') id = originalsRef.current.success(message, mergedOptions);
    else if (type === 'error') id = originalsRef.current.error(message, mergedOptions);
    else id = originalsRef.current.main(message, mergedOptions);

    toastMapRef.current.set(message, id);
    activeToastsRef.current.push({ id, message });
    return id;
  }, []);

  // Patch the imported `toast` methods so all existing `toast.success/error(...)` calls
  // route through the managed handler. We restore originals on cleanup.
  useEffect(() => {
    const orig = originalsRef.current;
    const patchedSuccess = (message, options) => showManagedToast(message, 'success', options);
    const patchedError = (message, options) => showManagedToast(message, 'error', options);

    // Replace methods
    toast.success = patchedSuccess;
    toast.error = patchedError;

    return () => {
      // restore originals
      toast.success = orig.success;
      toast.error = orig.error;
    };
  }, [showManagedToast]);

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
    showManagedToast,
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