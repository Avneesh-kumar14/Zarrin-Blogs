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
    error: 'bg-red-100 border-red-300 text-red-900',
    success: 'bg-green-100 border-green-300 text-green-900',
    info: 'bg-blue-100 border-blue-300 text-blue-900',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-900'
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
