import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  FiSettings,
  FiCheck,
  FiChevronRight,
} from 'react-icons/fi';
import { useNotifications } from '../../store/NotificationContext';
import { cn } from '../../utils/cn';

// Custom SVG Icons
const BellIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const EmptyBellIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// Optimized format time - memoized
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

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Memoized filtered notifications
  const getFilteredNotifications = useCallback(() => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  }, [activeTab, notifications]);

  // Memoized notification style getter
  const getNotificationStyle = useCallback((type) => {
    const styles = {
      order: { icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      wishlist: { icon: FiHeart, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
      promotion: { icon: FiPercent, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
      shipping: { icon: FiTruck, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
      price_drop: { icon: FiDollarSign, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
      review: { icon: FiStar, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    };
    return styles[type] || { icon: FiBell, color: 'text-primary-500', bg: 'bg-primary-100 dark:bg-primary-900/30' };
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read) markAsRead(notification._id);
    if (notification.actionUrl) {
      setTimeout(() => {
        onClose();
        window.location.href = notification.actionUrl;
      }, 200);
    }
  }, [markAsRead, onClose]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setShowClearConfirm(false);
  }, [clearAll]);

  const filteredNotifications = getFilteredNotifications();
  const hasUnread = useMemo(() => notifications.some(n => !n.read), [notifications]);

  // Memoized tabs data
  const tabs = useMemo(() => [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { id: 'promotion', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length },
    { id: 'wishlist', label: 'Wishlist', count: notifications.filter(n => n.type === 'wishlist').length },
  ], [notifications.length, unreadCount, notifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center sm:items-center p-4">
      {/* Backdrop - Removed motion */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal - Removed motion */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-[85vh] flex flex-col transition-all duration-200"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <BellIcon className="h-4.5 w-4.5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-white">Notifications</h2>
              <p className="text-xs text-neutral-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {hasUnread && (
              <button
                onClick={markAllAsRead}
                className="px-2.5 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-150 flex items-center gap-1.5 active:scale-95"
              >
                <FiCheck className="h-3 w-3" />
                Read all
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150 text-neutral-400 hover:text-red-500 active:scale-95"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-150 active:scale-95"
            >
              <FiX className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Tabs - Compact Scrollable Pills */}
        <div className="flex-shrink-0 flex gap-1 px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0 active:scale-95",
                activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full transition-colors duration-150",
                  activeTab === tab.id ? "bg-white/20" : "bg-neutral-200 dark:bg-neutral-700"
                )}>
                  {tab.count > 99 ? '99+' : tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List - Removed motion animations */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4">
                <EmptyBellIcon className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-sm font-semibold dark:text-white mb-1">No notifications</h3>
              <p className="text-xs text-neutral-500 text-center max-w-xs">
                {activeTab === 'all' 
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${activeTab} notifications yet.`}
              </p>
              {activeTab !== 'all' && (
                <button onClick={() => setActiveTab('all')} className="mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150">
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {filteredNotifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                const Icon = style.icon;
                
                return (
                  <div
                    key={notification._id}
                    className={cn(
                      "group relative transition-colors duration-150 cursor-pointer",
                      !notification.read && "bg-primary-50/40 dark:bg-primary-900/10",
                      "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-3.5">
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={cn("flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center", style.bg)}>
                          <Icon className={cn("h-4.5 w-4.5", style.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm leading-snug",
                                !notification.read ? "font-semibold dark:text-white" : "text-neutral-600 dark:text-neutral-400"
                              )}>
                                {notification.title}
                              </p>
                              {notification.message && (
                                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>

                          {/* Action Link */}
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-150"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View details
                              <FiChevronRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>

                        {/* Delete */}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                          className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-150"
                        >
                          <FiX className="h-3 w-3 text-neutral-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex-shrink-0 p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30">
            <Link
              to="/profile/notifications"
              className="flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
              onClick={onClose}
            >
              <FiSettings className="h-3.5 w-3.5" />
              Notification settings
            </Link>
          </div>
        )}
      </div>

      {/* Clear Confirm Modal - Simplified */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center transition-all duration-200"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold dark:text-white mb-2">Clear all notifications?</h3>
            <p className="text-sm text-neutral-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowClearConfirm(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150 dark:text-white active:scale-98"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearAll} 
                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-150 active:scale-98"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .h-4\\.5 { height: 1.125rem; }
        .w-4\\.5 { width: 1.125rem; }
        .active\:scale-95:active { transform: scale(0.95); }
        .active\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default NotificationsModal;