import React, { useState, useEffect } from 'react';
import Headings from '../Common/Heading';
import Button from '../Common/Button';
import Paragraph from '../Common/Paragraph';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newCategory })
      });
      if (!res.ok) throw new Error('Failed to create category');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete category');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit category
  const handleEditCategory = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: editName })
      });
      if (!res.ok) throw new Error('Failed to update category');
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const colorPalette = [
    'from-purple-500 to-purple-600',
    'from-blue-500 to-blue-600',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-cyan-600',
    'from-violet-500 to-violet-600',
    'from-fuchsia-500 to-fuchsia-600',
  ];

  const getGradient = (index) => colorPalette[index % colorPalette.length];
  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="mb-8">
          <Headings type="h2" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Category Management
          </Headings>
          <Paragraph className="text-gray-500 text-lg">Organize and manage your blog categories effortlessly</Paragraph>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <Paragraph className="text-red-700 font-semibold">{error}</Paragraph>
          </div>
        )}

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex gap-3 md:gap-4 flex-col md:flex-row">
              <div className="flex-1 relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add New Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  variant="primary"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Category
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div>
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <Paragraph className="text-gray-500 text-lg">No categories yet. Create one to get started!</Paragraph>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-r ${getGradient(index)} opacity-90`}></div>

                {/* Avatar Circle */}
                <div className="relative pt-6 pb-8 px-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {getInitial(category.name)}
                  </div>

                  {/* Content */}
                  {editingId === category._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 text-gray-800 font-semibold"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category._id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName('');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Headings type="h4" className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                        {category.name}
                      </Headings>
                      <Paragraph className="text-gray-500 text-sm mb-6">Manage this category</Paragraph>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(category._id);
                            setEditName(category.name);
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-12 text-center">
            <Paragraph className="text-gray-500 font-semibold">
              Total Categories: <span className="text-purple-600 text-lg">{categories.length}</span>
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;