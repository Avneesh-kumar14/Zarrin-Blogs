import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * ALERT COMPONENT
 * 
 * Dismissible alert with automatic timeout.
 * Types: 'error', 'success', 'warning', 'info'
 * 
 * Usage:
 *   <Alert type="success" message="Saved!" duration={3000} />
 */

const Alert = ({ 
  message, 
  type = 'error', // 'error', 'success', 'warning', 'info'
  onClose, 
  duration = 5000,
  className = '',
  title = null,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  if (!isVisible) return null;

  // Using design system colors
  const styles = {
    error: {
      container: 'bg-error/10 border-error',
      text: 'text-error',
      icon: AlertCircle,
    },
    success: {
      container: 'bg-success/10 border-success',
      text: 'text-success',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-warning/10 border-warning',
      text: 'text-warning',
      icon: AlertTriangle,
    },
    info: {
      container: 'bg-accent-primary/10 border-accent-primary',
      text: 'text-accent-primary',
      icon: Info,
    },
  };

  const { container, text, icon: Icon } = styles[type] || styles.info;

  return (
    <div 
      className={`alert border ${container} ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <Icon size={20} className={`flex-shrink-0 ${text}`} aria-hidden="true" />

      {/* Content */}
      <div className="flex-1">
        {title && (
          <h4 className={`font-medium ${text} mb-1`}>
            {title}
          </h4>
        )}
        <p className={`text-body-sm ${text}`}>
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className={`flex-shrink-0 ${text} hover:opacity-70 transition-opacity duration-200 p-1`}
        aria-label="Dismiss alert"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Alert;
