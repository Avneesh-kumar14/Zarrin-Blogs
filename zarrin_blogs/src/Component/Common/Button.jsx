import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  text, 
  onClick, 
  variant = 'primary', 
  className = '', 
  children,
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md',
    error: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center space-x-2 font-semibold rounded-md
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
  `;

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-disabled={disabled}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon size={18} />}
      {children}
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'outline', 'ghost']),
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
};

export default Button;

