import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import Paragraph from './Paragraph';

const Alert = ({ 
  message, 
  type = 'error', // 'error', 'success', 'warning', 'info'
  onClose, 
  duration = 5000,
  className = ''
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

  if (!isVisible) return null;

  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-600',
      text: 'text-red-700',
      icon: 'text-red-600',
      icon_component: <AlertCircle size={20} className="flex-shrink-0" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-600',
      text: 'text-green-700',
      icon: 'text-green-600',
      icon_component: <CheckCircle size={20} className="flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-l-4 border-amber-500',
      text: 'text-amber-700',
      icon: 'text-amber-600',
      icon_component: <AlertTriangle size={20} className="flex-shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-600',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      icon_component: <Info size={20} className="flex-shrink-0" />,
    }
  };

  const style = styles[type] || styles.error;

  return (
    <div className={`${style.bg} ${style.border} p-4 rounded-md flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-start gap-3 flex-1">
        <div className={style.icon}>
          {style.icon_component}
        </div>
        <Paragraph variant="sm" className={`${style.text} font-medium`}>
          {message}
        </Paragraph>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose && onClose();
        }}
        className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0 pt-1`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Alert;
