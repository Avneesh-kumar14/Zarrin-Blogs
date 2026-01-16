import React from 'react';
import PropTypes from 'prop-types';

/**
 * PARAGRAPH COMPONENT
 * 
 * Renders paragraphs with professional typography.
 * Variants: 'large' (18px for featured text), 'base' (16px default), 'small' (14px secondary)
 * 
 * Usage:
 *   <Paragraph variant="large">Article intro</Paragraph>
 *   <Paragraph>Body text</Paragraph>
 */

const Paragraph = ({ children, variant = 'base', className = '' }) => {
  const variants = {
    'large': 'text-body-lg text-text-primary',
    'base': 'text-body-base text-text-primary',
    'small': 'text-body-sm text-text-secondary',
  };

  return (
    <p className={`font-body leading-reading ${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['large', 'base', 'small']),
  className: PropTypes.string,
};

export default Paragraph;
