import React from 'react'

/**
 * CardSkeleton - Loading skeleton for blog cards
 * Shows shimmer effect while card is loading
 */
const CardSkeleton = ({ count = 1, delay = 0 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className="zcard-new" 
          style={{ 
            animationDelay: `${delay + idx * 0.1}s`,
            opacity: 0.6 
          }}
        >
          {/* Image placeholder with shimmer */}
          <div className="zcard-img-container">
            <div className="zcard-img-wrapper">
              <div 
                className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-64 rounded-t-2xl"
                style={{
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>

          {/* Content placeholder */}
          <div className="zcard-content p-6 space-y-4">
            {/* Category badge */}
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            </div>

            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6" />
            </div>

            {/* Meta info */}
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 w-1/2" />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% { backgroundPosition: 200% 0; }
          100% { backgroundPosition: -200% 0; }
        }
      `}</style>
    </>
  )
}

export default CardSkeleton
