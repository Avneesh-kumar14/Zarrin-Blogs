import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Headings from '../Common/Heading';
import Button from '../Common/Button';
import Paragraph from '../Common/Paragraph';
import Alert from '../Common/Alert';
import { Eye, Edit, Trash2, Plus, Calendar, Folder } from 'lucide-react';

const BlogManagement = ({ showAll = false }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
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
        endpoint = 'http://localhost:8200/api/blogs';
      } else {
        // For MyBlogs, get user's own blogs
        if (!userData.id) {
          setAlert({ type: 'error', message: 'Invalid user data. Please login again.' });
          return;
        }
        endpoint = `http://localhost:8200/api/blogs/user/${userData.id}`;
      }
      
      console.log('Fetching blogs from:', endpoint);
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8200/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`http://localhost:8200/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      setAlert({ type: 'success', message: 'Blog deleted successfully!' });
      fetchBlogs();
    } catch (err) {
      setAlert({ type: 'error', message: 'Error deleting blog: ' + err.message });
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Alert */}
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <Headings type="h2" className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent mb-2">
              {showAll ? '📚 All Posts' : '✍️ My Blogs'}
            </Headings>
            <Paragraph className="text-slate-600 dark:text-slate-400">
              {showAll ? 'Explore all published articles in the community' : 'Create, edit, and manage your published blogs'}
            </Paragraph>
          </div>
          
          {!showAll && (
            <button
              onClick={() => navigate('/blog/create')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Create New Blog</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin">
              <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all">
            <div className="text-5xl mb-4">📝</div>
            <Headings type="h4" className="text-gray-900 dark:text-white mb-2 text-xl">
              No blogs yet
            </Headings>
            <Paragraph className="text-slate-500 dark:text-slate-400 mb-6">
              {showAll ? 'No published articles found.' : 'Start writing your first blog post!'}
            </Paragraph>
            {!showAll && (
              <button
                onClick={() => navigate('/blog/create')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 inline-block"
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
                { border: 'border-indigo-200 dark:border-indigo-700', bg: 'bg-indigo-50/50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', accent: 'from-indigo-500 to-indigo-600' },
                { border: 'border-pink-200 dark:border-pink-700', bg: 'bg-pink-50/50 dark:bg-pink-900/20', icon: 'text-pink-600 dark:text-pink-400', accent: 'from-pink-500 to-pink-600' },
                { border: 'border-amber-200 dark:border-amber-700', bg: 'bg-amber-50/50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', accent: 'from-amber-500 to-amber-600' },
                { border: 'border-emerald-200 dark:border-emerald-700', bg: 'bg-emerald-50/50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', accent: 'from-emerald-500 to-emerald-600' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div 
                  key={blog._id} 
                  className={`bg-white dark:bg-slate-800 border-l-4 ${color.border} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-[1.02] origin-left`}
                >
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
                        <Headings type="h4" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                          {blog.title}
                        </Headings>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className={`flex items-center space-x-2 px-3 py-1 ${color.bg} rounded-lg`}>
                            <Folder size={16} className={color.icon} />
                            <span className="font-medium">
                              {blog.category && blog.category.length > 0 
                                ? blog.category.map(c => c.name).join(', ')
                                : 'Uncategorized'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
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
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => navigate(`/blog/${blog._id}/preview`)}
                        className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/30 to-indigo-100 dark:to-indigo-800/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/50 dark:hover:to-indigo-800/50 transition-all duration-300 hover:shadow-md`}
                      >
                        <Eye size={18} />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => navigate(`/blog/${blog._id}/edit`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-50 dark:from-pink-900/30 to-pink-100 dark:to-pink-800/30 text-pink-700 dark:text-pink-300 rounded-lg font-semibold hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/50 dark:hover:to-pink-800/50 transition-all duration-300 hover:shadow-md"
                      >
                        <Edit size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 dark:from-red-900/30 to-red-100 dark:to-red-800/30 text-red-700 dark:text-red-300 rounded-lg font-semibold hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/50 dark:hover:to-red-800/50 transition-all duration-300 hover:shadow-md"
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
    </div>
  );
};

export default BlogManagement;