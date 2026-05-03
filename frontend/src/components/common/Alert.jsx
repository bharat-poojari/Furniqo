// src/components/common/Alert.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';

const Alert = ({ 
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  icon: customIcon,
  autoClose = null,
  id // Optional ID for tracking alerts in a stack
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const autoCloseTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  // Handle auto-close functionality - Optimized
  useEffect(() => {
    if (autoClose && isVisible && !isExiting) {
      autoCloseTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, autoClose);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [autoClose, isVisible, isExiting]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    if (isExiting) return;
    
    // Clear auto-close timer if exists
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    
    // Start exit animation
    setIsExiting(true);
    
    // After animation completes, remove from DOM
    exitTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss(id);
      }
    }, 300);
  }, [onDismiss, isExiting, id]);

  const handleDismissClick = useCallback(() => {
    if (!isExiting) {
      handleDismiss();
    }
  }, [handleDismiss, isExiting]);

  // Icon mapping based on alert type - Memoized with useCallback
  const getIconByType = useCallback(() => {
    switch (type) {
      case 'success':
        return (
          <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  }, [type]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`alert alert--${type} ${isExiting ? 'alert--exiting' : 'alert--entering'} ${dismissible ? 'alert--dismissible' : ''}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="alert-content">
        <div className="alert-icon-wrapper">
          {customIcon || getIconByType()}
        </div>
        
        <div className="alert-text">
          {title && <h3 className="alert-title">{title}</h3>}
          {message && <p className="alert-message">{message}</p>}
        </div>

        {dismissible && (
          <button
            className="alert-dismiss"
            onClick={handleDismissClick}
            aria-label="Dismiss alert"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="dismiss-icon">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// AlertContainer component for managing multiple alerts - Optimized with memo
export const AlertContainer = React.memo(({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          dismissible={alert.dismissible}
          autoClose={alert.autoClose}
          onDismiss={onDismiss}
          icon={alert.icon}
        />
      ))}
    </div>
  );
});

AlertContainer.displayName = 'AlertContainer';

// CSS styles - Inlined but can be moved to external CSS
const styles = `
  /* Alert Container - for stacking multiple alerts */
  .alert-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: none;
  }

  @media (min-width: 640px) {
    .alert-container {
      left: auto;
      min-width: 380px;
      max-width: 450px;
    }
  }

  /* Base Alert Styles */
  .alert {
    pointer-events: auto;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    will-change: transform, opacity;
  }

  /* Animation States - Optimized with GPU acceleration */
  .alert--entering {
    animation: slideIn 0.3s ease-out forwards;
  }

  .alert--exiting {
    animation: slideOut 0.3s ease-in forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  /* Alert Content */
  .alert-content {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    gap: 0.75rem;
  }

  /* Icon Styles */
  .alert-icon-wrapper {
    flex-shrink: 0;
  }

  .alert-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Text Styles */
  .alert-text {
    flex: 1;
    min-width: 0;
  }

  .alert-title {
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
  }

  .alert-message {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* Dismiss Button */
  .alert-dismiss {
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    margin: -0.25rem;
    border-radius: 0.375rem;
    transition: opacity 0.2s ease;
  }

  .dismiss-icon {
    width: 1rem;
    height: 1rem;
  }

  .alert-dismiss:hover {
    opacity: 0.8;
  }

  .alert-dismiss:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  /* Success Alert */
  .alert--success {
    background-color: #f0fdf4;
    border-left: 4px solid #22c55e;
  }

  .alert--success .alert-icon {
    color: #22c55e;
  }

  .alert--success .alert-title {
    color: #166534;
  }

  .alert--success .alert-message {
    color: #15803d;
  }

  .alert--success .alert-dismiss {
    color: #166534;
  }

  /* Error Alert */
  .alert--error {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
  }

  .alert--error .alert-icon {
    color: #ef4444;
  }

  .alert--error .alert-title {
    color: #991b1b;
  }

  .alert--error .alert-message {
    color: #b91c1c;
  }

  .alert--error .alert-dismiss {
    color: #991b1b;
  }

  /* Warning Alert */
  .alert--warning {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
  }

  .alert--warning .alert-icon {
    color: #f59e0b;
  }

  .alert--warning .alert-title {
    color: #92400e;
  }

  .alert--warning .alert-message {
    color: #b45309;
  }

  .alert--warning .alert-dismiss {
    color: #92400e;
  }

  /* Info Alert */
  .alert--info {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
  }

  .alert--info .alert-icon {
    color: #3b82f6;
  }

  .alert--info .alert-title {
    color: #1e40af;
  }

  .alert--info .alert-message {
    color: #1e3a8a;
  }

  .alert--info .alert-dismiss {
    color: #1e40af;
  }

  /* Long message handling */
  .alert-message {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .alert--entering,
    .alert--exiting {
      animation: none;
    }
    
    .alert--entering {
      opacity: 1;
    }
    
    .alert--exiting {
      opacity: 0;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .alert-container {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
    }

    .alert-content {
      padding: 0.75rem;
    }

    .alert-title,
    .alert-message {
      font-size: 0.8125rem;
    }
  }
`;

// Hook for managing alert state in components - Optimized
export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const nextIdRef = useRef(0);

  const addAlert = useCallback((alert) => {
    const id = alert.id || `alert-${Date.now()}-${nextIdRef.current++}`;
    const newAlert = { ...alert, id };
    
    setAlerts(prev => [...prev, newAlert]);
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const showSuccess = useCallback((message, title = 'Success', options = {}) => {
    return addAlert({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addAlert]);

  const showError = useCallback((message, title = 'Error', options = {}) => {
    return addAlert({
      type: 'error',
      title,
      message,
      ...options
    });
  }, [addAlert]);

  const showWarning = useCallback((message, title = 'Warning', options = {}) => {
    return addAlert({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [addAlert]);

  const showInfo = useCallback((message, title = 'Info', options = {}) => {
    return addAlert({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addAlert]);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Optimized AlertProvider component
export const AlertProvider = React.memo(({ children }) => {
  const { alerts, removeAlert } = useAlert();

  return (
    <>
      <AlertContainer alerts={alerts} onDismiss={removeAlert} />
      {children}
    </>
  );
});

AlertProvider.displayName = 'AlertProvider';

export default Alert;