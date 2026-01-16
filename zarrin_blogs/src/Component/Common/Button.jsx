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
  type = 'button',
  ariaLabel = null,
}) => {
  /**
   * Professional button variants following the design system.
   * No gradients, no scale transforms. Subtle, professional styling.
   */
  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover active:scale-95 disabled:opacity-50',
    secondary: 'bg-bg-muted text-text-primary border border-border-light hover:bg-border-muted active:scale-95 disabled:opacity-50',
    outline: 'border-2 border-accent-primary text-accent-primary hover:bg-accent-soft active:scale-95 disabled:opacity-50',
    ghost: 'text-text-primary hover:bg-bg-muted active:scale-95 disabled:opacity-50',
    success: 'bg-success text-white hover:opacity-90 active:scale-95 disabled:opacity-50',
    danger: 'bg-error text-white hover:opacity-90 active:scale-95 disabled:opacity-50',
    warning: 'bg-warning text-white hover:opacity-90 active:scale-95 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-sm
    transition-all duration-200 ease-out
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary
    disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon size={18} aria-hidden="true" />}
      {children || text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'success', 'danger', 'warning']),
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
};

export default Button;

