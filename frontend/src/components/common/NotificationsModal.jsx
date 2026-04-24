// src/components/common/NotificationsModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiX,
  FiPackage,
  FiHeart,
  FiPercent,
  FiTruck,
  FiDollarSign,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiEye,
  FiSettings,
} from 'react-icons/fi';
import { useNotifications } from '../../store/NotificationContext';
import Button from './Button';
import { cn } from '../../utils/cn';

// Helper function to format time
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
};

const NotificationsModal = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const modalRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  // Get icon and color based on notification type
  const getNotificationStyle = (type) => {
    const styles = {
      order: { 
        icon: FiPackage, 
        color: 'text-blue-500', 
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      },
      wishlist: { 
        icon: FiHeart, 
        color: 'text-red-500', 
        bg: 'bg-red-50 dark:bg-red-900/20',
      },
      promotion: { 
        icon: FiPercent, 
        color: 'text-green-500', 
        bg: 'bg-green-50 dark:bg-green-900/20',
      },
      shipping: { 
        icon: FiTruck, 
        color: 'text-purple-500', 
        bg: 'bg-purple-50 dark:bg-purple-900/20',
      },
      price_drop: { 
        icon: FiDollarSign, 
        color: 'text-yellow-500', 
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      },
      review: { 
        icon: FiStar, 
        color: 'text-orange-500', 
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      },
      default: { 
        icon: FiBell, 
        color: 'text-primary-500', 
        bg: 'bg-primary-50 dark:bg-primary-900/20',
      }
    };
    return styles[type] || styles.default;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Close modal and navigate if there's an action URL
    if (notification.actionUrl) {
      setTimeout(() => {
        onClose();
        window.location.href = notification.actionUrl;
      }, 300);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  const filteredNotifications = getFilteredNotifications();
  const hasUnread = notifications.some(n => !n.read);

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All', icon: FiBell, count: notifications.length },
    { id: 'unread', label: 'Unread', icon: FiClock, count: unreadCount },
    { id: 'order', label: 'Orders', icon: FiPackage, count: notifications.filter(n => n.type === 'order').length },
    { id: 'promotion', label: 'Offers', icon: FiPercent, count: notifications.filter(n => n.type === 'promotion').length },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart, count: notifications.filter(n => n.type === 'wishlist').length },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <FiBell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {unreadCount === 0 
                  ? "You're all caught up!" 
                  : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnread && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <FiCheckCircle className="h-3 w-3" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500 hover:text-red-500"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count > 0 && tab.id !== 'all' && tab.id !== 'unread' && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                )}>
                  {tab.count}
                </span>
              )}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <FiBell className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                No notifications
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
                {activeTab === 'all' 
                  ? "You're all caught up! When you receive notifications, they'll appear here."
                  : `No ${activeTab} notifications to display.`}
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredNotifications.map((notification, index) => {
                const style = getNotificationStyle(notification.type);
                const Icon = style.icon;
                const timeAgo = formatTimeAgo(notification.createdAt);
                
                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "group relative transition-all cursor-pointer",
                      !notification.read && "bg-primary-50/30 dark:bg-primary-900/10",
                      "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-4">
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={cn("flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center", style.bg)}>
                          <Icon className={cn("h-5 w-5", style.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-grow">
                              <p className={cn(
                                "text-sm",
                                !notification.read 
                                  ? "font-semibold text-neutral-900 dark:text-white" 
                                  : "text-neutral-600 dark:text-neutral-400"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-neutral-400 whitespace-nowrap">
                                {timeAgo}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary-600 hover:text-primary-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details
                              <FiEye className="h-3 w-3" />
                            </Link>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                        >
                          <FiX className="h-3 w-3 text-neutral-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
            <Link
              to="/profile/notifications"
              className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              <FiSettings className="h-4 w-4" />
              Manage Notification Settings
            </Link>
          </div>
        )}
      </motion.div>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Clear All Notifications?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This action cannot be undone. All notifications will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleClearAll}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Yes, Clear All
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsModal;