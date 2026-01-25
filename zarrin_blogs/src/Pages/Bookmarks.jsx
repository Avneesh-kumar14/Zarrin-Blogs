import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, Clock, User, BookmarkX, Sparkles } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Button from '../Component/Common/Button';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Bookmarks = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/bookmarks'), {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch bookmarks');
      }

      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : (data.bookmarks || []));
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load bookmarks: ' + err.message });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [isAuthenticated, navigate, fetchBookmarks]);  const handleRemoveBookmark = async (blogId) => {
    setAlert({
      type: 'warning',
      message: 'Remove this bookmark? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          setDeleting(blogId);
          const token = localStorage.getItem('token');
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

          setBookmarks(bookmarks.filter(b => b.blog._id !== blogId));
          setAlert({ type: 'success', message: 'Bookmark removed successfully!' });
        } catch (err) {
          setAlert({ type: 'error', message: 'Failed to remove bookmark: ' + err.message });
        } finally {
          setDeleting(null);
        }
      }
    });
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}/preview`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
              <Bookmark size={32} className="text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-xs font-semibold">Your Reading List</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Saved Stories</h1>
            </div>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl">
            Keep your favorite articles handy for whenever you want to revisit them
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {alert && (
          <div className="mb-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
              duration={alert.isConfirmation ? 0 : 5000}
              isConfirmation={alert.isConfirmation}
              onConfirm={alert.onConfirm}
              onCancel={() => setAlert(null)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 mb-4"></div>
            <Paragraph className="text-gray-600 dark:text-gray-400 text-lg">Loading your bookmarks...</Paragraph>
          </div>
        ) : bookmarks.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Bookmark size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                </span>
              </div>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookmarks.map((bookmark) => (
                <article
                  key={bookmark._id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-slate-700"
                >
                  {/* Image Container */}
                  {bookmark.blog.image && (
                    <div className="relative overflow-hidden h-52 bg-gray-200 dark:bg-slate-700">
                      <img
                        src={bookmark.blog.image}
                        alt={bookmark.blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Bookmark Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Bookmark size={12} className="fill-current" />
                        Saved
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Category */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg">
                        {bookmark.blog.category?.name || 'Story'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {bookmark.blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {bookmark.blog.description || bookmark.blog.short_description || 'Click to read the full story...'}
                    </p>

                    {/* Author Info */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        {bookmark.blog.author && (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {bookmark.blog.author.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {bookmark.blog.author.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {bookmark.blog.readingTime || '5 min'} read
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleViewBlog(bookmark.blog._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Read
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.blog._id)}
                        disabled={deleting === bookmark.blog._id}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 disabled:opacity-50 border border-red-200 dark:border-red-800"
                        title="Remove bookmark"
                      >
                        {deleting === bookmark.blog._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-red-600"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-16 text-center">
            <BookmarkX size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Start exploring blogs and bookmark your favorites to create your personal reading list
            </p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Sparkles size={20} />
              Explore Blogs
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Bookmarks;
