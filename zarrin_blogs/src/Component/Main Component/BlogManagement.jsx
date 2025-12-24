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
    <div className="p-4 sm:p-8 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 min-h-screen">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Headings type="h2" className="text-3xl sm:text-4xl font-bold text-gray-900">
              {showAll ? '📚 All Posts' : '✍️ My Blogs'}
            </Headings>
            <Paragraph className="text-gray-600 mt-2">
              {showAll ? 'Browse all published articles' : 'Manage your published blogs'}
            </Paragraph>
          </div>
          
          {!showAll && (
            <button
              onClick={() => navigate('/blog/create')}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Create New Blog</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Headings type="h4" className="text-gray-600 mb-2">
              📝 No blogs yet
            </Headings>
            <Paragraph className="text-gray-500">
              {showAll ? 'No published articles found.' : 'Start writing your first blog post!'}
            </Paragraph>
            {!showAll && (
              <button
                onClick={() => navigate('/blog/create')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Your First Blog
              </button>
            )}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6 sm:p-8">
                  {/* Blog Info */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    {/* Image Thumbnail */}
                    {blog.images && blog.images[0] && (
                      <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={blog.images[0]} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <Headings type="h4" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </Headings>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Folder size={16} className="text-blue-600" />
                          <span className="font-medium">
                            {blog.category && blog.category.length > 0 
                              ? blog.category.map(c => c.name).join(', ')
                              : 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} className="text-green-600" />
                          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <Paragraph className="text-gray-700 line-clamp-2 mb-4">
                        {blog.short_description || blog.blog_content?.substring(0, 150) + '...'}
                      </Paragraph>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/blog/${blog._id}/preview`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-semibold hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                    >
                      <Eye size={18} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => navigate(`/blog/${blog._id}/edit`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg font-semibold hover:from-purple-100 hover:to-purple-200 transition-all duration-300"
                    >
                      <Edit size={18} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-300"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;