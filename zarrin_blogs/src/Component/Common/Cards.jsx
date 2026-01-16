
import React from 'react';
import Paragraph from './Paragraph';
import Image from './Image';
import Heading from './Heading';
import Button from './Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

/**
 * CARD COMPONENT - Blog Post Card
 * 
 * Professional blog card with image, title, excerpt, date.
 * Uses design system colors, typography, and spacing.
 * Minimal hover effects - no heavy transformations.
 */

const Cards = ({
  id = '',
  imageSrc = '/Assets/beach.png',
  imageAlt = 'Card Image',
  headingSmall = '',
  headingLarge = '',
  paragraph = '',
  buttonText = '',
  buttonVariant = 'primary',
  createdAt = '',
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${id}/preview`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group h-full card-interactive flex flex-col"
    >
      {/* Image Container - Subtle zoom on hover */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 rounded-sm">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        {headingSmall && (
          <div className="absolute top-4 left-4 bg-bg-surface/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-text-primary uppercase tracking-wide">
              {headingSmall}
            </span>
          </div>
        )}
      </div>

      {/* Content Container - Professional spacing */}
      <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
        {/* Date and Meta Info */}
        {createdAt && (
          <div className="flex items-center gap-2 text-caption text-text-muted mb-3">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </div>
        )}

        {/* Title */}
        <div className="mb-3">
          <Heading 
            type="h5" 
            className="text-lg sm:text-xl text-text-primary line-clamp-2 group-hover:text-accent-primary transition-colors duration-200"
          >
            {headingLarge}
          </Heading>
        </div>

        {/* Description */}
        <div className="mb-4 flex-1">
          <Paragraph 
            variant="small"
            className="line-clamp-3"
          >
            {paragraph}
          </Paragraph>
        </div>

        {/* Read More Link */}
        {buttonText && (
          <div className="flex items-center gap-2 group/link">
            <span className="text-body-sm font-medium text-accent-primary group-hover/link:text-accent-hover transition-colors duration-200">
              {buttonText}
            </span>
            <ArrowRight 
              size={16} 
              className="text-accent-primary transition-transform duration-200 group-hover/link:translate-x-0.5"
            />
          </div>
        )}
      </div>    
    </div>
  );
}
Cards.propTypes = {
  id: PropTypes.string,
  imageSrc: PropTypes.string, 
  imageAlt: PropTypes.string,   
  headingSmall: PropTypes.string,

  headingLarge: PropTypes.string,
  paragraph: PropTypes.string,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.string,
  createdAt: PropTypes.string,
};
export default Cards;