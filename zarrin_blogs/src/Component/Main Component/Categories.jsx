import React, { useState, useEffect } from "react";
import { Trash, X } from "lucide-react";
import Button from '../Common/Button';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8200/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
      setError("");
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      setError("This category already exists");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to create categories");
        return;
      }

      const res = await fetch('http://localhost:8200/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.trim() })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const newCat = await res.json();
      setCategories([...categories, newCat]);
      setNewCategory("");
      setShowCreateForm(false);
      setSuccess("Category created successfully!");
      setError("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Create error:', err);
      setError(err.message || 'Error creating category');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8200/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      setCategories(categories.filter(cat => cat._id !== id));
      setSuccess("Category deleted successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Error deleting category');
    }
  };

  return (
    <div className="p-6 w-full max-w-full">
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!showCreateForm && (
        <Button
          onClick={() => setShowCreateForm(true)}
          className="mb-6 px-4 py-2 bg-primary text-tertiary rounded-lg hover:bg-secondary transition"
        >
          Create Category
        </Button>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-tertiary w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <Button
              onClick={() => {
                setShowCreateForm(false);
                setError("");
              }}
              className="absolute top-3 right-3 text-secondary hover:text-dark"
            >
              <X className="w-5 h-5" />
            </Button>

            <Heading type="h5" className="font-semibold mb-4">
              Add New Category
            </Heading>

            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="block w-full mb-4 p-2 border border-secondaryGray rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  setError("");
                }}
                className="px-4 py-2 bg-secondaryGray text-dark rounded-lg hover:bg-secondary transition"
              >
                Cancel
              </Button>
              <Button
                onClick={addCategory}
                className="px-4 py-2 bg-primary text-tertiary rounded-lg hover:bg-secondary transition"
              >
                Save Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {!showCreateForm && (
        <>
          {loading ? (
            <Paragraph className="text-secondary">Loading categories...</Paragraph>
          ) : categories.length > 0 ? (
            <div>
              <Heading type="h6" className="font-semibold mb-4">
                All Categories ({categories.length})
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex justify-between items-center p-4 border border-secondaryGray rounded-lg bg-tertiary shadow-sm hover:shadow-md transition"
                  >
                    <Heading type="h6" className="font-bold">
                      <span className="font-normal text-dark">{cat.name}</span>
                    </Heading>

                    <Button
                      onClick={() => deleteCategory(cat._id)}
                      className="p-2 bg-tertiary hover:bg-red-100 rounded transition"
                      title="Delete category"
                    >
                      <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Paragraph className="text-secondary">
              No categories available. Create one to get started!
            </Paragraph>
          )}
        </>
      )}
    </div>
  );
};

export default Categories;