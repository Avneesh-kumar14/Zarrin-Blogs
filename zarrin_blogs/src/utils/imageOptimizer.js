/**
 * Image Optimizer Utility
 * Optimizes Cloudinary URLs for better performance and caching
 * 
 * Features:
 * - Responsive image sizing
 * - Format optimization (webp/auto)
 * - Quality optimization
 * - CDN caching headers
 */

export const imageOptimizer = {
  /**
   * Generate optimized Cloudinary URL with transformations
   */
  getOptimizedUrl: (cloudinaryUrl, options = {}) => {
    if (!cloudinaryUrl) return null;
    
    const {
      width = null,
      height = null,
      quality = 'auto',
      format = 'auto',
      fetch_format = 'auto',
      crop = 'fill',
      gravity = 'auto',
      devicePixelRatio = 1,
    } = options;

    // Parse Cloudinary URL
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    
    // Insert transformation parameters
    // Format: /cloudinary/upload/[TRANSFORMATIONS]/...
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return cloudinaryUrl; // Not a valid Cloudinary URL

    // Build transformation string
    let transformations = [];
    
    // Quality and format
    transformations.push(`q_${quality}`);
    transformations.push(`f_${fetch_format}`);
    
    // Sizing
    if (width || height) {
      const w = width ? Math.ceil(width * devicePixelRatio) : undefined;
      const h = height ? Math.ceil(height * devicePixelRatio) : undefined;
      
      if (w && h) {
        transformations.push(`w_${w},h_${h},c_${crop},g_${gravity}`);
      } else if (w) {
        transformations.push(`w_${w},c_scale`);
      } else if (h) {
        transformations.push(`h_${h},c_scale`);
      }
    }

    // Join transformations
    const transformationString = transformations.join(',');
    pathParts.splice(uploadIndex + 1, 0, transformationString);

    return url.origin + pathParts.join('/');
  },

  /**
   * Get responsive image srcSet for different device sizes
   */
  getResponsiveImageSrcSet: (cloudinaryUrl, baseWidth = 600) => {
    if (!cloudinaryUrl) return null;

    const devicePixelRatios = [1, 2];
    const breakpoints = [320, 640, 960, 1280, 1920];

    return breakpoints
      .flatMap(width => 
        devicePixelRatios.map(dpr => ({
          url: imageOptimizer.getOptimizedUrl(cloudinaryUrl, { 
            width, 
            devicePixelRatio: dpr 
          }),
          descriptor: dpr === 1 ? `${width}w` : `${width}w`
        }))
      )
      .map(({ url, descriptor }) => `${url} ${descriptor}`)
      .join(', ');
  },

  /**
   * Get blur-up placeholder (low-quality image)
   */
  getBlurUpUrl: (cloudinaryUrl) => {
    return imageOptimizer.getOptimizedUrl(cloudinaryUrl, {
      width: 50,
      height: 50,
      quality: '40',
      fetch_format: 'auto'
    });
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl: (cloudinaryUrl, size = 200) => {
    return imageOptimizer.getOptimizedUrl(cloudinaryUrl, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face,auto',
      quality: '80',
      fetch_format: 'auto'
    });
  },

  /**
   * Get high-quality image for hero sections
   */
  getHeroImageUrl: (cloudinaryUrl, width = 1920) => {
    return imageOptimizer.getOptimizedUrl(cloudinaryUrl, {
      width,
      quality: '90',
      fetch_format: 'auto'
    });
  },

  /**
   * Get card image (most common use case)
   */
  getCardImageUrl: (cloudinaryUrl, width = 400, height = 300) => {
    return imageOptimizer.getOptimizedUrl(cloudinaryUrl, {
      width,
      height,
      crop: 'fill',
      gravity: 'auto',
      quality: '85',
      fetch_format: 'auto'
    });
  },

  /**
   * Check if URL is a Cloudinary URL
   */
  isCloudinaryUrl: (url) => {
    return url && url.includes('cloudinary.com');
  },

  /**
   * Extract Cloudinary public ID from URL
   */
  getPublicId: (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;
    
    const matches = cloudinaryUrl.match(/\/v\d+\/(.+?)(?:\.\w+)?$/);
    return matches ? matches[1] : null;
  },

  /**
   * Get cache headers for different image types
   */
  getCacheHeaders: (imageType = 'default') => {
    const cacheConfig = {
      default: 'public, max-age=31536000, immutable', // 1 year
      thumbnail: 'public, max-age=2592000, immutable', // 30 days
      hero: 'public, max-age=86400, must-revalidate', // 1 day
      avatar: 'public, max-age=604800, must-revalidate' // 7 days
    };

    return cacheConfig[imageType] || cacheConfig.default;
  }
};

export default imageOptimizer;
