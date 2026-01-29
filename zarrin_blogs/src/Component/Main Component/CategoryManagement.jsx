
import React, { useState, useEffect } from 'react';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategory = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: editName }),
      });
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900">
        <Headings type="h2">📁 Category Management</Headings>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAddCategory} className="mb-6 flex gap-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border px-3 py-2 flex-1"
            placeholder="New Category"
            required
          />
          <button className="bg-indigo-600 text-white px-4 py-2">
            Add
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-slate-800 p-5 rounded shadow"
            >
              {editingId === category._id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border w-full px-3 py-2 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category._id)}
                      className="bg-green-600 text-white px-3 py-2 flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 px-3 py-2 flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold mb-2">
                    {getInitial(category.name)} {category.name}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category._id);
                        setEditName(category.name);
                      }}
                      className="bg-blue-600 text-white px-3 py-2 flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-600 text-white px-3 py-2 flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {categories.length > 0 && (
          <Paragraph className="mt-6 text-center">
            Total Categories: {categories.length}
          </Paragraph>
        )}
      </div>
    </>
  );
};

export default CategoryManagement;
