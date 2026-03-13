import React, { useState, useEffect } from 'react'

const Image = ({ 
  src, 
  alt, 
  onLoad,
  onError,
  placeholder = '/Assets/beach.png',
  fallback = '/Assets/beach.png',
  retryCount = 3,
  retryDelay = 1000,
  ...args 
}) => {
  const [imageSrc, setImageSrc] = useState(src || placeholder)
  const [isLoading, setIsLoading] = useState(!!src)
  const [hasError, setHasError] = useState(false)
  const [retryAttempts, setRetryAttempts] = useState(0)

  // Handle image load success
  const handleLoad = (e) => {
    setIsLoading(false)
    setHasError(false)
    setRetryAttempts(0)
    if (onLoad) onLoad(e)
  }

  // Handle image load error with retry logic
  const handleError = (e) => {
    console.warn(`❌ Image failed to load: ${src}`)
    
    // Retry mechanism
    if (retryAttempts < retryCount) {
      console.log(`🔄 Retrying image load... (Attempt ${retryAttempts + 1}/${retryCount})`)
      setRetryAttempts(prev => prev + 1)
      
      // Exponential backoff
      const delay = retryDelay * Math.pow(1.5, retryAttempts)
      const timer = setTimeout(() => {
        setImageSrc(src + `?t=${Date.now()}`) // Add cache buster
      }, delay)
      
      return () => clearTimeout(timer)
    } else {
      // After all retries fail, use fallback
      console.error(`❌ Image failed after ${retryCount} retries. Using fallback.`)
      setHasError(true)
      setImageSrc(fallback)
      setIsLoading(false)
      if (onError) onError(e)
    }
  }

  // Update source when src prop changes
  useEffect(() => {
    if (src && src !== imageSrc) {
      setImageSrc(src)
      setHasError(false)
      setRetryAttempts(0)
      setIsLoading(true)
    }
  }, [src, imageSrc])

  return (
    <>
      <img 
        src={imageSrc} 
        alt={alt || 'Image'} 
        onLoad={handleLoad}
        onError={handleError}
        data-loading={isLoading}
        data-error={hasError}
        {...args}
        style={{
          opacity: isLoading && !hasError ? 0.6 : 1,
          transition: 'opacity 0.3s ease-in-out',
          ...args.style
        }}
      />
      {isLoading && !hasError && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.05)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} 
        />
      )}
    </>
  )
}

export default Image