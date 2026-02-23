import React, { useState, useEffect, useCallback } from 'react';
import { Flame, TrendingUp, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrendingBlogs = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  const fetchTrendingBlogs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching trending from:', `${API_URL}/trending?limit=6`);
      const res = await fetch(`${API_URL}/trending?limit=6`);
      if (!res.ok) throw new Error('Failed to fetch trending blogs');
      const data = await res.json();
      console.log('✅ Trending blogs received:', data.length);
      setTrending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching trending blogs:', err);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTrendingBlogs();
  }, [fetchTrendingBlogs]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 dark:border-orange-900 border-t-orange-600"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-3">Loading trending blogs...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-warning rounded-lg">
            <TrendingUp size={24} className="text-on-primary" />
          </div>
          <h2 className="text-4xl font-bold text-warning">
            Trending Now 🔥
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Most popular and engaging blogs this week
        </p>
      </div>

      {/* Trending Grid */}
      {trending.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((blog, index) => (
            <div
              key={blog._id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              onClick={() => navigate(`/blog/${blog._id}/preview`)}
            >
              {/* Trending Badge */}
              <div className="absolute top-4 right-4 bg-warning text-on-primary px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg transform group-hover:scale-110 transition-transform">
                #{index + 1}
              </div>

              {/* Image */}
              {blog.images && blog.images.length > 0 && (
                <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                  <img
                    src={blog.images[0]}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {blog.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {blog.short_description}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-md">
                    {blog.author?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {blog.author?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-400">
                    <Eye size={16} />
                    <span>{blog.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400">
                    <Heart size={16} className="fill-current" />
                    <span>{blog.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-primary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark">
          <Flame size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No trending blogs yet. Be the first to create one!
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendingBlogs;
