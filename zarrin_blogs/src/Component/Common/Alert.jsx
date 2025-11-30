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
      border: 'border-red-500',
      text: 'text-red-700',
      icon: <AlertCircle size={20} className="flex-shrink-0" />,
      emoji: '❌'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: <CheckCircle size={20} className="flex-shrink-0" />,
      emoji: '✅'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: <AlertTriangle size={20} className="flex-shrink-0" />,
      emoji: '⚠️'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      icon: <Info size={20} className="flex-shrink-0" />,
      emoji: 'ℹ️'
    }
  };

  const style = styles[type] || styles.error;

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded animate-shake flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-start gap-3 flex-1">
        {style.icon}
        <Paragraph className={`${style.text} font-semibold`}>
          {message}
        </Paragraph>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose && onClose();
        }}
        className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default Alert;
