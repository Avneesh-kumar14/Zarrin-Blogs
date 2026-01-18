import React from 'react';
import PropTypes from 'prop-types';

const Paragraph = ({ children, variant = 'body', className = '' }) => {
  const variants = {
    'lg': 'text-lg text-slate-700 leading-relaxed font-font2',
    'body': 'text-base text-slate-700 leading-relaxed font-font2',
    'sm': 'text-sm text-slate-600 leading-relaxed font-font2',
    'muted': 'text-slate-500 leading-relaxed font-font2',
  };

  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['lg', 'body', 'sm', 'muted']),
  className: PropTypes.string,
};

export default Paragraph;
