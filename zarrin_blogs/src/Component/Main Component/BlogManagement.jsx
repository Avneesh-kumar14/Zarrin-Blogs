import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Headings from '../Common/Heading';
import Button from '../Common/Button';
import Paragraph from '../Common/Paragraph';

const BlogManagement = ({ showAll = false }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      let endpoint;
      
      if (showAll) {
        endpoint = 'http://localhost:8200/api/blogs';
      } else {
        // For MyBlogs, get user's own blogs
        endpoint = `http://localhost:8200/api/blogs/user/${userData.id}`;
      }
      
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch blogs error:', err);
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
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const res = await fetch(`http://localhost:8200/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      fetchBlogs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <Headings type="h4" className="text-2xl font-semibold mb-6">
        {showAll ? 'All Posts' : 'My Blogs'}
      </Headings>
      
      {error && <Paragraph className="text-red-500 mb-4">{error}</Paragraph>}

      <div className="mb-8">
        <Button
          onClick={() => navigate('/blog/create')}
          variant="primary"
          className="px-6 py-2"
        >
          Create New Blog
        </Button>
      </div>

      {/* Blogs List */}
      <div className="space-y-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-tertiary p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Headings type="h5" className="text-xl font-semibold mb-2">{blog.title}</Headings>
                <div className="flex gap-4 text-sm text-secondary mb-4">
                  <span>Category: {blog.category ? blog.category.name : 'Uncategorized'}</span>
                  <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <Paragraph className="text-gray-600 mb-4">
                  {blog.short_description || blog.blog_content.substring(0, 150) + '...'}
                </Paragraph>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Preview
                </Button>
                <Button
                  onClick={() => navigate(`/blog/${blog._id}/edit`)}
                  variant="primary"
                  className="px-4 py-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteBlog(blog._id)}
                  variant="danger"
                  className="px-4 py-2"
                >
                  Delete
                </Button>
              </div>
            </div>
            <Paragraph className="text-dark">
              {blog.blog_content && blog.blog_content.length > 200 ? `${blog.blog_content.substring(0, 200)}...` : blog.blog_content}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;