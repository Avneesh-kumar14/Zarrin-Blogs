import React from 'react'

/**
 * BlogSkeleton - Loading skeleton for individual blog posts
 */
const BlogSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        
        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5" />
        </div>

        {/* Meta info */}
        <div className="flex gap-6 pt-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Featured image skeleton */}
      <div 
        className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-96 rounded-lg"
        style={{
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite'
        }}
      />

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx}>
            {idx % 5 === 3 ? (
              // Occasional larger line for headers
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mb-3" />
            ) : (
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
            )}
          </div>
        ))}
      </div>

      {/* Author section skeleton */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
        <div className="flex gap-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { backgroundPosition: 200% 0; }
          100% { backgroundPosition: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export default BlogSkeleton
