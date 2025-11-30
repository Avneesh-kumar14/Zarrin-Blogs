
import React from 'react';
import Paragraph from './Paragraph';
import Image from './Image';
import Heading from './Heading';
import Button from './Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

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
    navigate(`/blog/${id}`);
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
      className="group h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:translate-y-[-8px] flex flex-col border border-gray-100"
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        {headingSmall && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {headingSmall}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
        {/* Date and Meta Info */}
        {createdAt && (
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-1">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </div>
        )}

        {/* Title */}
        <div className="mb-3">
          <Heading 
            type="h5" 
            className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
          >
            {headingLarge}
          </Heading>
        </div>

        {/* Description */}
        <div className="mb-4 flex-1">
          <Paragraph 
            className="text-sm text-gray-600 leading-relaxed line-clamp-3 opacity-85"
          >
            {paragraph}
          </Paragraph>
        </div>

        {/* Read More Button */}
        {buttonText && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
              {buttonText}
            </span>
            <ArrowRight 
              size={16} 
              className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

Cards.propTypes = {
  id: PropTypes.string,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  headingSmall: PropTypes.string,
  headingLarge: PropTypes.string,
  paragraph: PropTypes.string,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.oneOf(['primary', 'outline', 'dark', 'read']),
  createdAt: PropTypes.string,
};

export default Cards;

