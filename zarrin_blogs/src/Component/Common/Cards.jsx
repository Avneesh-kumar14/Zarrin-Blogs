
// import React from 'react';
// import Paragraph from './Paragraph';
// import Image from './Image';
// import Heading from './Heading';
// import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
// import { ArrowRight, Calendar, Heart, MessageCircle } from 'lucide-react';

// const Cards = ({
//   id = '',
//   imageSrc = null,
//   imageAlt = 'Card Image',
//   headingSmall = '',
//   headingLarge = '',
//   paragraph = '',
//   buttonText = '',
//   buttonVariant = 'primary',
//   createdAt = '',
//   likes = 0,
//   comments = 0,
// }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     navigate(`/blog/${id}/preview`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return '';
//     }
//   };

//   // Color rotation for visual variety using design system colors
//   const colors = [
//     "primary",
//     "secondary",
//     "accent"
//   ];

//   const colorIndex = (id?.charCodeAt(0) || 0) % colors.length;
//   const accentColor = colors[colorIndex];

//   // Use placeholder if no image provided
//   const displayImage = imageSrc || '/Assets/beach.png';

//   // Debug logging
//   if (!imageSrc) {
//     console.warn('📷 No image provided for card:', id, 'using default');
//   }

//   return (
//     <div 
//       onClick={handleCardClick}
//       className="group h-full bg-surface-primary dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-border-light dark:border-neutral-700 hover:border-border-default dark:hover:border-neutral-600"
//     >
//       {/* Color Top Border */}
//       <div className={`h-1 bg-${accentColor}`}></div>

//       {/* Image Container */}
//       <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
//         <Image
//           src={displayImage}
//           alt={imageAlt}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
        
//         {/* Category Badge */}
//         {headingSmall && (
//           <div className={`absolute top-4 left-4 bg-${accentColor} text-on-${accentColor} px-3 py-1.5 rounded-lg shadow-lg font-semibold text-xs uppercase tracking-wider`}>
//             {headingSmall}
//           </div>
//         )}

//         {/* Bookmark Button */}
//         <button 
//           className="absolute top-4 right-4 h-10 w-10 rounded-full bg-surface-primary/90 hover:bg-surface-primary flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <Heart className="w-5 h-5 text-text-secondary hover:text-error dark:hover:text-error-light" />
//         </button>
//       </div>

//       {/* Content Container */}
//       <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 space-y-4">
//         {/* Date and Meta Info */}
//         {createdAt && (
//           <div className="flex items-center text-xs text-text-tertiary dark:text-neutral-400 space-x-2">
//             <Calendar size={14} />
//             <span>{formatDate(createdAt)}</span>
//           </div>
//         )}

//         {/* Title */}
//         <div>
//           <Heading 
//             type="h5" 
//             className={`line-clamp-2 group-hover:text-${accentColor} transition-all duration-200 text-text-primary dark:text-text-inverse`}
//           >
//             {headingLarge}
//           </Heading>
//         </div>

//         {/* Description */}
//         <div className="flex-1">
//           <Paragraph 
//             variant="sm"
//             className="line-clamp-3 text-text-secondary dark:text-neutral-400"
//           >
//             {paragraph}
//           </Paragraph>
//         </div>

//         {/* Engagement Stats */}
//         <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-neutral-400 border-t border-border-light dark:border-neutral-700 pt-3">
//           <div className="flex items-center gap-1 hover:text-error transition-colors">
//             <Heart size={16} className="group-hover:fill-error" />
//             <span>{likes || 0}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <MessageCircle size={16} />
//             <span>{comments || 0}</span>
//           </div>
//         </div>

//         {/* Read More Link */}
//         {buttonText && (
//           <div className={`flex items-center space-x-2 pt-2 text-${accentColor} group-hover:gap-2 transition-all duration-200`}>
//             <span className="text-sm font-semibold">
//               {buttonText}
//             </span>
//             <ArrowRight 
//               size={16} 
//               className="group-hover:translate-x-1 transition-transform duration-200"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// Cards.propTypes = {
//   id: PropTypes.string,
//   imageSrc: PropTypes.string,
//   imageAlt: PropTypes.string,
//   headingSmall: PropTypes.string,
//   headingLarge: PropTypes.string, 
//   paragraph: PropTypes.string,
//   buttonText: PropTypes.string,
//   buttonVariant: PropTypes.string,
//   createdAt: PropTypes.string,
//   likes: PropTypes.number,
//   comments: PropTypes.number,
// };    
// export default Cards;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Bookmark, BookOpen, Heart, Eye } from 'lucide-react';
import PropTypes from 'prop-types';

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
  const [isLiked, setIsLiked] = useState(false);

  const handleCardClick = () => { navigate(`/blog/${id}/preview`); };
  const handleLike = (e) => { e.stopPropagation(); setIsLiked(!isLiked); };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch { return ''; }
  };

  /* ── Color Palette (Bookmarks-style) ── */
  const colorPalette = [
    { accent: '#2B64D4', light: 'rgba(43,100,212,0.08)', dark: '#1A3F8A' },
    { accent: '#1E8A56', light: 'rgba(30,138,86,0.08)', dark: '#156B44' },
    { accent: '#7040CC', light: 'rgba(112,64,204,0.08)', dark: '#4A2680' },
    { accent: '#C49A3C', light: 'rgba(196,154,60,0.08)', dark: '#A07C28' },
  ];
  const color = colorPalette[(id?.charCodeAt(0) || 0) % colorPalette.length];
  const displayImage = imageSrc || '/Assets/beach.png';
  
  console.log(`🖼️ Cards component rendered for blog "${headingLarge}":`, {
    id: id,
    hasImageSrc: !!imageSrc,
    imageSrc: imageSrc ? imageSrc.substring(0, 70) + '...' : 'NULL/UNDEFINED',
    displayImage: displayImage.substring(0, 70) + '...',
    showingDefault: !imageSrc
  });

  return (
    <>
      <article 
        onClick={handleCardClick}
        className="zcard-new"
        style={{ '--accent': color.accent, '--accent-light': color.light, '--accent-dark': color.dark, animationDelay: `${(id?.charCodeAt(0) || 0) * 0.06}s` }}
      >
        {/* Gradient backdrop */}
        <div className="zcard-backdrop" />

        {/* Image Container */}
        <div className="zcard-img-container">
          <div className="zcard-img-wrapper">
            {imageSrc ? (
              <img src={displayImage} alt={imageAlt} className="zcard-img" />
            ) : (
              <div className="zcard-placeholder"><BookOpen size={40} color="rgba(255,255,255,0.5)" /></div>
            )}
            <div className="zcard-overlay" />
          </div>

          {/* Category Badge */}
          {headingSmall && (
            <div className="zcard-category-badge">{headingSmall}</div>
          )}
          
          {/* Heart Badge */}
          <button 
            className="zcard-heart-badge"
            onClick={handleLike}
            title="Like article"
          >
            <Heart size={12} className={isLiked ? 'zcard-heart-fill' : ''} />
            Like
          </button>
        </div>

        {/* Content */}
        <div className="zcard-content">
          {/* Meta Info */}
          <div className="zcard-meta">
            <span className="zcard-meta-item">
              <Clock size={12} />
              {formatDate(createdAt)}
            </span>
            <span className="zcard-meta-item">
              <Eye size={12} />
              5 min read
            </span>
          </div>

          {/* Title */}
          <h3 className="zcard-title">{headingLarge}</h3>

          {/* Description */}
          <p className="zcard-desc">{paragraph || 'Click to read the full story…'}</p>

          {/* Actions */}
          <div className="zcard-actions">
            <button onClick={handleCardClick} className="zcard-read-btn">
              <span>Read Article</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleLike}
              className="zcard-like-btn"
              title="Like"
            >
              <Heart size={16} className={isLiked ? 'zcard-like-filled' : ''} />
            </button>
          </div>
        </div>
      </article>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .zcard-new {
          position: relative;
          font-family: 'Outfit', sans-serif;
          background: var(--color-surface-primary,#fff);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.5s ease both;
          cursor: pointer;
          height: 100%;
        }

        .zcard-new:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: var(--accent);
        }

        .zcard-backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent-light), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .zcard-new:hover .zcard-backdrop {
          opacity: 1;
        }

        .zcard-img-container {
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .zcard-img-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
        }

        .zcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .zcard-new:hover .zcard-img {
          transform: scale(1.1) rotate(1deg);
        }

        .zcard-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        }

        .zcard-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
        }

        .zcard-heart-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.95);
          color: var(--accent);
          font-size: 10px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .zcard-heart-badge:hover {
          transform: scale(1.08);
          background: var(--accent);
          color: #fff;
        }

        .zcard-heart-fill {
          fill: var(--accent);
        }

        .zcard-category-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.95);
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1.5px solid var(--accent);
        }

        .zcard-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .zcard-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: var(--color-text-muted, #B0B0AD);
        }

        .zcard-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .zcard-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-text-primary, #111);
          line-height: 1.3;
          margin: 0;
          transition: color 0.3s ease;
        }

        .zcard-new:hover .zcard-title {
          color: var(--accent);
        }

        .zcard-desc {
          font-size: 13px;
          color: var(--color-text-secondary, #4A4A48);
          line-height: 1.5;
          margin: 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .zcard-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          justify-content: space-between;
        }

        .zcard-read-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          flex: 1;
        }

        .zcard-read-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .zcard-like-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(204, 46, 46, 0.08);
          border: 1.5px solid rgba(204, 46, 46, 0.2);
          color: var(--color-error, #CC2E2E);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .zcard-like-btn:hover:not(:disabled) {
          background: var(--color-error, #CC2E2E);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(204, 46, 46, 0.3);
        }

        .zcard-like-filled {
          fill: currentColor;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
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
  buttonVariant: PropTypes.string,
  createdAt: PropTypes.string,
  likes: PropTypes.number,
  comments: PropTypes.number,
};

export default Cards;