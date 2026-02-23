import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    error: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />
  };

  const bgColors = {
    error: 'bg-error-bg border-error/30 dark:border-error/40 text-error dark:text-error-light',
    success: 'bg-success-bg border-success/30 dark:border-success/40 text-success dark:text-success-light',
    info: 'bg-info-bg border-info/30 dark:border-info/40 text-info dark:text-info-light',
    warning: 'bg-warning-bg border-warning/30 dark:border-warning/40 text-warning dark:text-warning-light'
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[type]} animate-in slide-in-from-top-2 mb-2 shadow-lg`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button 
        className="flex-shrink-0 hover:opacity-70 transition"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
