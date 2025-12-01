// Calculate reading time based on word count
// Average reading speed: 200 words per minute
export const calculateReadingTime = (content) => {
  if (!content) return 0;
  
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Count words
  const wordCount = plainText.trim().split(/\s+/).length;
  
  // Calculate minutes
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return minutes;
};

// Format reading time for display
export const formatReadingTime = (minutes) => {
  if (minutes <= 1) return '< 1 min read';
  if (minutes <= 5) return `${minutes} min read`;
  return `${Math.ceil(minutes / 5) * 5} min read`;
};

// Get word count
export const getWordCount = (content) => {
  if (!content) return 0;
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.trim().split(/\s+/).length;
};
