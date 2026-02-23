import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import Paragraph from './Paragraph';

const Alert = ({ 
  message, 
  type = 'error', // 'error', 'success', 'warning', 'info'
  onClose, 
  duration = 5000,
  className = '',
  isConfirmation = false,
  onConfirm = null,
  onCancel = null
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0 && !isConfirmation) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isConfirmation]);

  if (!isVisible) return null;

  const styles = {
    error: {
      bg: 'bg-error-bg dark:bg-error-dark/20',
      border: 'border-l-4 border-error dark:border-error-dark',
      text: 'text-error-dark dark:text-error-light',
      icon: 'text-error dark:text-error-light',
      icon_component: <AlertCircle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-error-bg/50 dark:hover:bg-error-dark/30',
      confirmBtn: 'bg-error hover:bg-error-dark dark:bg-error-dark dark:hover:bg-error text-on-error',
    },
    success: {
      bg: 'bg-success-bg dark:bg-success-dark/20',
      border: 'border-l-4 border-success dark:border-success-dark',
      text: 'text-success-dark dark:text-success-light',
      icon: 'text-success dark:text-success-light',
      icon_component: <CheckCircle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-success-bg/50 dark:hover:bg-success-dark/30',
      confirmBtn: 'bg-success hover:bg-success-dark dark:bg-success-dark dark:hover:bg-success text-on-success',
    },
    warning: {
      bg: 'bg-warning-bg dark:bg-warning-dark/20',
      border: 'border-l-4 border-warning dark:border-warning-dark',
      text: 'text-warning-dark dark:text-warning-light',
      icon: 'text-warning dark:text-warning-light',
      icon_component: <AlertTriangle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-warning-bg/50 dark:hover:bg-warning-dark/30',
      confirmBtn: 'bg-warning hover:bg-warning-dark dark:bg-warning-dark dark:hover:bg-warning text-on-warning',
    },
    info: {
      bg: 'bg-info-bg dark:bg-info-dark/20',
      border: 'border-l-4 border-info dark:border-info-dark',
      text: 'text-info-dark dark:text-info-light',
      icon: 'text-info dark:text-info-light',
      icon_component: <Info size={20} className="flex-shrink-0" />,
      button: 'hover:bg-info-bg/50 dark:hover:bg-info-dark/30',
      confirmBtn: 'bg-info hover:bg-info-dark dark:bg-info-dark dark:hover:bg-info text-on-info',
    }
  };

  const style = styles[type] || styles.error;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    setIsVisible(false);
    onClose && onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setIsVisible(false);
    onClose && onClose();
  };

  return (
    <div className={`${style.bg} ${style.border} p-4 md:p-5 rounded-xl flex flex-col md:flex-row md:items-start md:justify-between gap-4 shadow-lg backdrop-blur-sm border border-opacity-20 transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-3 flex-1">
        <div className={`${style.icon} pt-0.5 flex-shrink-0`}>
          {style.icon_component}
        </div>
        <Paragraph variant="sm" className={`${style.text} font-semibold leading-relaxed`}>
          {message}
        </Paragraph>
      </div>

      {isConfirmation ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCancel}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${style.text} hover:opacity-80`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`${style.confirmBtn} px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200`}
          >
            Delete
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose && onClose();
          }}
          className={`${style.button} ${style.text} transition-all duration-200 flex-shrink-0 p-1 rounded-lg`}
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
