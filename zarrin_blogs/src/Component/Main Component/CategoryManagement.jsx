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

  return (
    <div className="p-6">
      <Headings type="h4" className="text-2xl font-semibold mb-6">Category Management</Headings>
      
      {error && <Paragraph className="text-red-500 mb-4">{error}</Paragraph>}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 px-4 py-2 border border-secondaryGray rounded-md"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-2"
            variant="primary"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </Button>
        </div>
      </form>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            {editingId === category._id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-4 py-2 border border-secondaryGray rounded-md mr-4"
              />
            ) : (
              <Paragraph className="text-dark">{category.name}</Paragraph>
            )}
            
            <div className="flex gap-2">
              {editingId === category._id ? (
                <>
                  <Button
                    onClick={() => handleEditCategory(category._id)}
                    variant="primary"
                    className="px-4 py-2"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    variant="secondary"
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditingId(category._id);
                      setEditName(category.name);
                    }}
                    variant="secondary"
                    className="px-4 py-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category._id)}
                    variant="danger"
                    className="px-4 py-2"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;