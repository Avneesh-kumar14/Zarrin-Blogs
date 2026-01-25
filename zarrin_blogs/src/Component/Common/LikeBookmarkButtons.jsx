import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import Alert from './Alert';
import { getApiUrl } from '../../utils/apiConfig';

const LikeBookmarkButtons = ({ blogId, isAuthenticated, onLikeChange }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [alert, setAlert] = useState(null);

  // Fetch initial state and like count
  const fetchLikeData = useCallback(async () => {
    try {
      // Get like count
      const countRes = await fetch(
        getApiUrl(`/api/likes/count/${blogId}`),
        {
          credentials: 'include' // CRITICAL for production: include cookies/JWT in CORS requests
        }
      );
      if (countRes.ok) {
        const countData = await countRes.json();
        setLikeCount(countData.count || 0);
      }

      // Check if user liked
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        const checkRes = await fetch(
          getApiUrl(`/api/likes/check/${blogId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            credentials: 'include' // CRITICAL: include cookies for production CORS
          }
        );
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          setIsLiked(checkData.liked || false);
        }
      }
    } catch (err) {
      console.error('Error fetching like data:', err);
    }
  }, [blogId, isAuthenticated]);

  const fetchBookmarkData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        getApiUrl(`/api/bookmarks/check/${blogId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: 'include' // CRITICAL: include cookies for production CORS
        }
      );
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked || false);
      }
    } catch (err) {
      console.error('Error fetching bookmark data:', err);
    }
  }, [blogId, isAuthenticated]);

  useEffect(() => {
    fetchLikeData();
    fetchBookmarkData();
  }, [blogId, isAuthenticated, fetchLikeData, fetchBookmarkData]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setAlert({ type: 'warning', message: 'Please log in to like blogs' });
      return;
    }

    try {
      setLoadingLike(true);
      const token = localStorage.getItem('token');

      if (isLiked) {
        // Unlike
        const res = await fetch(
          getApiUrl(`/api/likes/${blogId}`),
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            },
            credentials: 'include' // CRITICAL: include cookies for production CORS
          }
        );

        if (!res.ok) throw new Error('Failed to unlike');
        const data = await res.json();
        setIsLiked(false);
        setLikeCount(data.count || 0);
        onLikeChange && onLikeChange(data.count);
      } else {
        // Like
        const res = await fetch(
          getApiUrl(`/api/likes/${blogId}`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            credentials: 'include', // CRITICAL: include cookies for production CORS
            body: JSON.stringify({})
          }
        );

        if (!res.ok) throw new Error('Failed to like');
        const data = await res.json();
        setIsLiked(true);
        setLikeCount(data.count || 0);
        onLikeChange && onLikeChange(data.count);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: isLiked ? 'Failed to unlike blog' : 'Failed to like blog'
      });
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      setAlert({ type: 'warning', message: 'Please log in to bookmark blogs' });
      return;
    }

    try {
      setLoadingBookmark(true);
      const token = localStorage.getItem('token');

      if (isBookmarked) {
        // Remove bookmark
        const res = await fetch(
          getApiUrl(`/api/bookmarks/${blogId}`),
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            },
            credentials: 'include' // CRITICAL: include cookies for production CORS
          }
        );

        if (!res.ok) throw new Error('Failed to remove bookmark');
        setIsBookmarked(false);
        setAlert({
          type: 'info',
          message: 'Bookmark removed'
        });
      } else {
        // Add bookmark
        const res = await fetch(
          getApiUrl(`/api/bookmarks/${blogId}`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            credentials: 'include', // CRITICAL: include cookies for production CORS
            body: JSON.stringify({})
          }
        );

        if (!res.ok) throw new Error('Failed to bookmark');
        setIsBookmarked(true);
        setAlert({
          type: 'success',
          message: 'Blog bookmarked successfully!'
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: isBookmarked
          ? 'Failed to remove bookmark'
          : 'Failed to bookmark blog'
      });
    } finally {
      setLoadingBookmark(false);
    }
  };

  return (
    <>
      {alert && (
        <div className="mb-4">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={3000}
          />
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isLiked ? 'Unlike this blog' : 'Like this blog'}
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-current' : ''}
            strokeWidth={2}
          />
          <span>
            {loadingLike ? 'Loading...' : isLiked ? 'Liked' : 'Like'}
          </span>
          {likeCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-sm">
              {likeCount}
            </span>
          )}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          disabled={loadingBookmark}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isBookmarked
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this blog'}
        >
          <Bookmark
            size={20}
            className={isBookmarked ? 'fill-current' : ''}
            strokeWidth={2}
          />
          <span>
            {loadingBookmark
              ? 'Loading...'
              : isBookmarked
              ? 'Bookmarked'
              : 'Bookmark'}
          </span>
        </button>
      </div>
    </>
  );
};

export default LikeBookmarkButtons;
