
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
import React from 'react';
import Paragraph from './Paragraph';
import Image from './Image';
import Heading from './Heading';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, MessageCircle, Clock, Bookmark } from 'lucide-react';

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

  /* ── EXISTING handlers — preserved exactly ── */
  const handleCardClick = () => { navigate(`/blog/${id}/preview`); };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  };

  /* ── EXISTING color system — preserved exactly ── */
  const colors = ["primary", "secondary", "accent"];
  const colorIndex = (id?.charCodeAt(0) || 0) % colors.length;
  const accentColor = colors[colorIndex];

  const displayImage = imageSrc || '/Assets/beach.png';

  if (!imageSrc) { console.warn('📷 No image provided for card:', id, 'using default'); }

  /* ── Accent CSS variable map ── */
  const accentVarMap = {
    primary: 'var(--color-primary,#2B64D4)',
    secondary: 'var(--color-secondary,#1E8A56)',
    accent: 'var(--color-accent,#7040CC)',
  };
  const accentVar = accentVarMap[accentColor] || accentVarMap.primary;

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`zcard-root h-full bg-surface-primary dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-border-light dark:border-neutral-700 hover:border-border-default dark:hover:border-neutral-600`}
        style={{ '--zc-accent': accentVar }}
      >
        {/* EXISTING: Color top border */}
        <div className={`h-1 bg-${accentColor}`} />

        {/* EXISTING: Image container */}
        <div className="relative overflow-hidden zcard-img-wrap">
          <Image src={displayImage} alt={imageAlt} className="w-full h-full object-cover zcard-img" />
          <div className="absolute inset-0 bg-black/40" />

          {/* EXISTING: Category badge */}
          {headingSmall && (
            <div className={`absolute top-4 left-4 bg-${accentColor} text-on-${accentColor} px-3 py-1.5 rounded-lg shadow-lg font-semibold text-xs uppercase tracking-wider`}>
              {headingSmall}
            </div>
          )}

          {/* EXISTING: Bookmark button */}
          <button
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-surface-primary/90 hover:bg-surface-primary flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-5 h-5 text-text-secondary hover:text-error dark:hover:text-error-light" />
          </button>

          {/* NEW: Reading time overlay */}
          {createdAt && (
            <div className="zcard-read-time">
              <Clock size={11} />
              <span>5 min read</span>
            </div>
          )}
        </div>

        {/* EXISTING: Content container */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 space-y-4">

          {/* EXISTING: Date meta */}
          {createdAt && (
            <div className="flex items-center text-xs text-text-tertiary dark:text-neutral-400 space-x-2">
              <Calendar size={14} />
              <span>{formatDate(createdAt)}</span>
            </div>
          )}

          {/* EXISTING: Title */}
          <div>
            <Heading
              type="h5"
              className={`line-clamp-2 group-hover:text-${accentColor} transition-all duration-200 text-text-primary dark:text-text-inverse zcard-title`}
            >
              {headingLarge}
            </Heading>
          </div>

          {/* EXISTING: Description */}
          <div className="flex-1">
            <Paragraph variant="sm" className="line-clamp-3 text-text-secondary dark:text-neutral-400">
              {paragraph}
            </Paragraph>
          </div>

          {/* EXISTING: Engagement stats */}
          <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-neutral-400 border-t border-border-light dark:border-neutral-700 pt-3">
            <div className="flex items-center gap-1 hover:text-error transition-colors">
              <Heart size={16} className="group-hover:fill-error" />
              <span>{likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{comments || 0}</span>
            </div>

            {/* NEW: Bookmark action */}
            <button
              className="zcard-bm-btn ml-auto"
              onClick={(e) => e.stopPropagation()}
              title="Save article"
            >
              <Bookmark size={14} />
            </button>
          </div>

          {/* EXISTING: Read more link */}
          {buttonText && (
            <div className={`flex items-center space-x-2 pt-2 text-${accentColor} group-hover:gap-2 transition-all duration-200`}>
              <span className="text-sm font-semibold">{buttonText}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </div>

        {/* NEW: Bottom accent bar on hover */}
        <div className="zcard-bottom-bar" />
      </article>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .zcard-root { position: relative; font-family: 'Outfit', sans-serif; }
        .zcard-root:hover { transform: translateY(-4px); }

        .zcard-img-wrap { height: 12rem; }
        @media(min-width:640px){ .zcard-img-wrap { height: 14rem; } }
        @media(min-width:768px){ .zcard-img-wrap { height: 16rem; } }

        .zcard-img { transition: transform 0.5s ease; }
        .zcard-root:hover .zcard-img { transform: scale(1.08); }

        .zcard-read-time {
          position: absolute; bottom: 12px; left: 12px;
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.85);
          font-size: 10px; font-weight: 600; padding: 4px 9px;
          border-radius: 100px; backdrop-filter: blur(6px);
        }

        .zcard-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          transition: color 0.2s;
        }
        .zcard-root:hover .zcard-title { color: var(--zc-accent) !important; }

        .zcard-bm-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px;
          background: transparent; border: 1px solid var(--color-border-light,#EEE);
          color: var(--color-text-muted,#B0B0AD); cursor: pointer;
          transition: all 0.18s;
        }
        .zcard-bm-btn:hover {
          background: var(--zc-accent);
          border-color: var(--zc-accent);
          color: #fff;
        }

        .zcard-bottom-bar {
          height: 2px;
          background: var(--zc-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .zcard-root:hover .zcard-bottom-bar { transform: scaleX(1); }
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