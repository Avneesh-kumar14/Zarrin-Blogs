
import React from 'react';
import Paragraph from './Paragraph';
import Image from './Image';
import Heading from './Heading';
import Button from './Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, MessageCircle } from 'lucide-react';

const Cards = ({
  id = '',
  imageSrc = null,
  imageAlt = 'Card Image',
  headingSmall = '',
  headingLarge = '',
  paragraph = '',
  buttonText = '',
  buttonVariant = 'primary',
  createdAt = '',
  likes = 0,
  comments = 0,
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

  // Gradient rotation for visual variety
  const gradients = [
    "from-[#6366F1] to-[#8B5CF6]",
    "from-[#EC4899] to-[#F472B6]",
    "from-[#06B6D4] to-[#6366F1]"
  ];

  const gradientIndex = (id?.charCodeAt(0) || 0) % gradients.length;
  const gradient = gradients[gradientIndex];

  // Use placeholder if no image provided
  const displayImage = imageSrc || '/Assets/beach.png';

  return (
    <div 
      onClick={handleCardClick}
      className="group h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600"
    >
      {/* Gradient Top Border */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>

      {/* Image Container */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
        <Image
          src={displayImage}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Category Badge */}
        {headingSmall && (
          <div className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} text-white px-3 py-1.5 rounded-lg shadow-lg font-semibold text-xs uppercase tracking-wider`}>
            {headingSmall}
          </div>
        )}

        {/* Bookmark Button */}
        <button 
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 space-y-4">
        {/* Date and Meta Info */}
        {createdAt && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <Heading 
            type="h5" 
            className={`line-clamp-2 group-hover:bg-gradient-to-r group-hover:${gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200 text-gray-900 dark:text-white`}
          >
            {headingLarge}
          </Heading>
        </div>

        {/* Description */}
        <div className="flex-1">
          <Paragraph 
            variant="sm"
            className="line-clamp-3 text-gray-600 dark:text-gray-400"
          >
            {paragraph}
          </Paragraph>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-slate-700 pt-3">
          <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart size={16} className="group-hover:fill-red-500" />
            <span>{likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{comments || 0}</span>
          </div>
        </div>

        {/* Read More Link */}
        {buttonText && (
          <div className={`flex items-center space-x-2 pt-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all duration-200`}>
            <span className="text-sm font-semibold">
              {buttonText}
            </span>
            <ArrowRight 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-200 text-gray-600 dark:text-gray-400 group-hover:text-transparent"
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
  likes: PropTypes.number,
  comments: PropTypes.number,
};    
export default Cards;