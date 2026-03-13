import { useEffect, useRef, useState } from 'react';

/**
 * useLazyImage Hook
 * Lazy loads images using Intersection Observer API
 * Improves performance by loading images only when they're visible
 */
export const useLazyImage = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholderColor = '#f0f0f0'
  } = options;

  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Start loading the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.onload = () => {
                setIsLoaded(true);
                img.classList.add('lazy-loaded');
              };
              img.onerror = () => {
                setIsError(true);
                img.classList.add('lazy-error');
              };
            }

            // Stop observing this image
            observer.unobserve(img);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return { imgRef, isLoaded, isError };
};

/**
 * LazyImage Component
 * Wrapper for lazy-loaded images
 */
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/Assets/beach.png',
  width,
  height,
  className = '',
  onLoad,
  ...props 
}) => {
  const { imgRef, isLoaded } = useLazyImage({
    threshold: 0.1,
    rootMargin: '50px'
  });

  return (
    <img
      ref={imgRef}
      data-src={src}
      src={placeholder}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
      onLoad={onLoad}
      {...props}
    />
  );
};

export default useLazyImage;
