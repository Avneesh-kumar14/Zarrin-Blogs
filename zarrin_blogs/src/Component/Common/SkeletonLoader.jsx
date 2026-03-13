import React from 'react'

/**
 * SkeletonLoader - Generic skeleton component for any content
 */
const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  variant = 'text',
  count = 1,
  className = '' 
}) => {
  const variants = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangular: 'rounded-lg',
    avatar: 'rounded-full w-12 h-12'
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`}
          style={{
            width,
            height,
            marginBottom: count > 1 && idx < count - 1 ? '8px' : '0'
          }}
        />
      ))}
    </>
  )
}

export default SkeletonLoader
