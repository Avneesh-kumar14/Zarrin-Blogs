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
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-l-4 border-red-500 dark:border-red-600',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
      icon_component: <AlertCircle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      confirmBtn: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-l-4 border-emerald-500 dark:border-emerald-600',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: 'text-emerald-600 dark:text-emerald-400',
      icon_component: <CheckCircle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-l-4 border-amber-500 dark:border-amber-600',
      text: 'text-amber-800 dark:text-amber-200',
      icon: 'text-amber-600 dark:text-amber-400',
      icon_component: <AlertTriangle size={20} className="flex-shrink-0" />,
      button: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-l-4 border-blue-500 dark:border-blue-600',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
      icon_component: <Info size={20} className="flex-shrink-0" />,
      button: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white',
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
