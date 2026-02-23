import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Alert from '../Common/Alert';
import { Eye, Edit, Trash2, Plus, Calendar, Folder } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const BlogManagement = ({ showAll = false }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        setAlert({ type: 'error', message: 'User not authenticated. Please login again.' });
        return;
      }
      
      const userData = JSON.parse(userString);
      let endpoint;
      
      if (showAll) {
        endpoint = getApiUrl('/api/blogs'); // Use centralized API URL for production
      } else {
        // For MyBlogs, get user's own blogs
        if (!userData._id && !userData.id) {
          setAlert({ type: 'error', message: 'Invalid user data. Please login again.' });
          return;
        }
        const userId = userData._id || userData.id;
        endpoint = getApiUrl(`/api/blogs/user/${userId}`); // Use centralized API URL for production
      }
      
      console.log('Fetching blogs from:', endpoint);
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to fetch blogs`);
      }
      
      const data = await res.json();
      console.log('Response received:', data);
      
      // Handle different response structures
      const blogsList = data.data || data;
      setBlogs(Array.isArray(blogsList) ? blogsList : []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch blogs: ' + err.message });
      console.error('Fetch blogs error:', err);
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  // Fetch categories for the dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/categories'), {
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      // Categories are fetched but not used in state to match original behavior
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  // Delete blog
  const handleDeleteBlog = async (id) => {
    setAlert({
      type: 'warning',
      message: 'Are you sure you want to delete this blog? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          const res = await fetch(getApiUrl(`/api/blogs/${id}`), {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include' // CRITICAL: include cookies for production CORS
          });
          if (!res.ok) throw new Error('Failed to delete blog');
          setAlert({ type: 'success', message: 'Blog deleted successfully!' });
          fetchBlogs();
        } catch (err) {
          setAlert({ type: 'error', message: 'Error deleting blog: ' + err.message });
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-8 bg-surface-primary dark:bg-surface-dark min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 dark:bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Alert */}
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <Headings type="h2" className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              {showAll ? '📚 All Posts' : '✍️ My Blogs'}
            </Headings>
            <Paragraph className="text-text-secondary dark:text-text-secondary">
              {showAll ? 'Explore all published articles in the community' : 'Create, edit, and manage your published blogs'}
            </Paragraph>
          </div>
          
          {!showAll && (
            <button
              onClick={() => navigate('/blog/create')}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-on-primary px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Create New Blog</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary p-[3px]">
              <div className="w-full h-full bg-surface-primary dark:bg-surface-dark rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-border-default dark:border-border-dark border-t-primary"></div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-16 bg-surface-primary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-default dark:border-border-dark shadow-sm hover:shadow-md transition-all">
              <div className="inline-block p-4 bg-primary rounded-2xl mb-6">
              <div className="text-5xl">📝</div>
            </div>
            <Headings type="h4" className="text-primary mb-2 text-xl font-bold">
              No blogs yet
            </Headings>
            <Paragraph className="text-text-secondary dark:text-text-secondary mb-6">
              {showAll ? 'No published articles found.' : 'Start writing your first blog post!'}
            </Paragraph>
            {!showAll && (
              <button
                onClick={() => navigate('/blog/create')}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 inline-block"
              >
                Create Your First Blog
              </button>
            )}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {blogs.map((blog, index) => {
              const colors = [
                { color: 'primary', light: 'bg-primary/10 dark:bg-primary/20', text: 'text-primary dark:text-primary-light' },
                { color: 'secondary', light: 'bg-secondary/10 dark:bg-secondary/20', text: 'text-secondary dark:text-secondary-light' },
                { color: 'accent', light: 'bg-accent/10 dark:bg-accent/20', text: 'text-accent dark:text-accent-light' },
                { color: 'warning', light: 'bg-warning/10 dark:bg-warning/20', text: 'text-warning dark:text-warning-light' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div 
                  key={blog._id} 
                  className="bg-surface-primary dark:bg-surface-dark rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-[1.01] border border-border-default dark:border-border-dark backdrop-blur"
                >
                  {/* Gradient Top Border */}
                  <div className={`h-1 bg-${color.color}`}></div>

                  <div className="p-6 sm:p-8">
                    {/* Blog Info */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      {/* Image Thumbnail */}
                      {blog.images && blog.images[0] && (
                        <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                          <img 
                            src={blog.images[0]} 
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <Headings type="h4" className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-3">
                          {blog.title}
                        </Headings>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className={`flex items-center space-x-2 px-3 py-1 ${color.light} rounded-lg`}>
                            <Folder size={16} className={color.text} />
                            <span className="font-medium">
                              {blog.category && blog.category.length > 0 
                                ? blog.category.map(c => c.name).join(', ')
                                : 'Uncategorized'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Calendar size={16} className="text-slate-600 dark:text-slate-400" />
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <Paragraph className="text-slate-700 dark:text-slate-300 line-clamp-2 mb-4">
                          {blog.short_description || blog.blog_content?.substring(0, 150) + '...'}
                        </Paragraph>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border-default dark:border-border-dark">
                      <button
                        onClick={() => navigate(`/blog/${blog._id}/preview`)}
                        className={`flex items-center space-x-2 px-4 py-2 bg-${['primary', 'secondary', 'accent', 'warning'][index % 4]} text-on-primary rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform`}
                      >
                        <Eye size={18} />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => navigate(`/blog/${blog._id}/edit`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-dark text-on-accent rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
                      >
                        <Edit size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-error hover:bg-error-dark text-on-error rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
      `}</style>
    </div>
  );
};

export default BlogManagement;