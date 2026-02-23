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
    primary: 'bg-primary hover:bg-primary-dark text-on-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary hover:bg-secondary-dark text-on-secondary shadow-sm hover:shadow-md',
    success: 'bg-success hover:bg-success-dark text-on-success shadow-sm hover:shadow-md',
    error: 'bg-error hover:bg-error-dark text-on-error shadow-sm hover:shadow-md',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-surface-tertiary dark:hover:bg-neutral-700',
    ghost: 'bg-transparent text-text-primary dark:text-text-primary hover:bg-surface-secondary dark:hover:bg-neutral-800',
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
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light
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

