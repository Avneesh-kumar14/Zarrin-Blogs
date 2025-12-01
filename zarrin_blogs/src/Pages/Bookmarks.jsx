import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Button from '../Component/Common/Button';
import Alert from '../Component/Common/Alert';

const Bookmarks = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [isAuthenticated, navigate]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8200/api/bookmarks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
  };

  const handleRemoveBookmark = async (blogId) => {
    if (!window.confirm('Remove this bookmark?')) return;

    try {
      setDeleting(blogId);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8200/api/bookmarks/${blogId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error('Failed to remove bookmark');

      setBookmarks(bookmarks.filter(b => b.blog._id !== blogId));
      setAlert({ type: 'success', message: 'Bookmark removed' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to remove bookmark: ' + err.message });
    } finally {
      setDeleting(null);
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}/preview`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark size={32} />
            <Heading type="h1" className="text-4xl md:text-5xl font-bold">
              My Bookmarks
            </Heading>
          </div>
          <Paragraph className="text-blue-50 text-lg">
            Your saved blogs for reading later
          </Paragraph>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {alert && (
          <div className="mb-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
              duration={5000}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400"></div>
              <Paragraph className="mt-4 text-gray-600 dark:text-gray-300">Loading bookmarks...</Paragraph>
            </div>
          </div>
        ) : bookmarks.length > 0 ? (
          <>
            <Paragraph className="text-gray-600 dark:text-gray-300 mb-8 font-semibold">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
            </Paragraph>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  {bookmark.blog.images && bookmark.blog.images[0] && (
                    <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={bookmark.blog.images[0]}
                        alt={bookmark.blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-950 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Bookmark size={14} className="fill-current" />
                        Saved
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Category */}
                    {bookmark.blog.category && bookmark.blog.category[0] && (
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded-full mb-3">
                        {bookmark.blog.category[0].name}
                      </span>
                    )}

                    {/* Title */}
                    <Heading type="h4" className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                      {bookmark.blog.title}
                    </Heading>

                    {/* Description */}
                    <Paragraph className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {bookmark.blog.short_description}
                    </Paragraph>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                      <span>{bookmark.blog.author?.name || 'Anonymous'}</span>
                      <span>
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewBlog(bookmark.blog._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-blue-600 text-white py-2 rounded-lg hover:shadow-md transition-all font-semibold"
                      >
                        Read
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.blog._id)}
                        disabled={deleting === bookmark.blog._id}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove bookmark"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
            <Bookmark size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <Heading type="h3" className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              No bookmarks yet
            </Heading>
            <Paragraph className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking blogs to save them for later reading
            </Paragraph>
            <Button
              onClick={() => navigate('/blog')}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition-all"
              text="Explore Blogs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
