import React, { useState, useEffect } from "react";
import { Trash2, Plus, Folder, CheckCircle, Loader2, FolderOpen } from "lucide-react";
import Heading from "../Component/Common/Heading";
import Paragraph from "../Component/Common/Paragraph";
import Alert from "../Component/Common/Alert";
import { getApiUrl } from "../utils/apiConfig";

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please login.");
        setLoading(false);
        return;
      }

      const res = await fetch(getApiUrl("/api/categories"), {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || "Unable to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      const res = await fetch(getApiUrl("/api/categories"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ name: newCategory.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setCategories([...categories, data]);
      setNewCategory("");
      setShowCreateForm(false);
      setSuccess("Category created successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
  };

  const deleteCategory = async (id) => {
    setAlert({
      type: 'warning',
      message: 'Delete this category? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          setDeleteLoading(id);
          const token = localStorage.getItem("token");
          
          if (!token) {
            setAlert({ type: 'error', message: 'Authentication required' });
            return;
          }

          const res = await fetch(getApiUrl(`/api/categories/${id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to delete category");
          }

          setCategories(categories.filter((c) => c._id !== id));
          setAlert({ type: 'success', message: 'Category deleted successfully!' });
        } catch (err) {
          setAlert({ type: 'error', message: err.message || 'Delete failed' });
        } finally {
          setDeleteLoading(null);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-primary rounded-2xl shadow-lg text-on-primary">
              <FolderOpen className="w-8 h-8 text-on-primary" />
            </div>
            <div>
              <Heading type="h1" className="text-4xl font-bold text-text-primary dark:text-text-inverse">
                Category Management
              </Heading>
              <Paragraph variant="muted" className="text-text-secondary dark:text-text-secondary">
                Create and manage content categories for your blog
              </Paragraph>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            New Category
          </button>
        </div>

        {/* Alerts */}
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={5000}
            isConfirmation={alert.isConfirmation}
            onConfirm={alert.onConfirm}
            onCancel={alert.onCancel}
          />
        )}
        {error && <Alert message={error} type="error" onClose={() => setError("")} />}
        {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-text-primary dark:text-text-inverse mb-6">Create New Category</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="w-full px-4 py-3 border-2 border-border-light dark:border-border-dark rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface-primary dark:bg-surface-dark text-text-primary dark:text-text-inverse placeholder-text-secondary"
                />
              </div>
              <button
                onClick={addCategory}
                className="px-8 py-3 bg-success hover:bg-success-dark text-on-primary font-bold rounded-lg transition-all transform hover:scale-105"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewCategory("");
                }}
                className="px-8 py-3 border-2 border-border-default dark:border-border-dark text-text-primary dark:text-text-inverse hover:bg-surface-secondary dark:hover:bg-neutral-800 font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Categories", value: categories.length, icon: Folder, bgClass: "bg-primary" },
                { label: "Active", value: categories.filter(c => c.active !== false).length, icon: CheckCircle, bgClass: "bg-success" },
                { label: "Archived", value: categories.filter(c => c.active === false).length, icon: FolderOpen, bgClass: "bg-warning" }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgClass} flex items-center justify-center mb-4 shadow-md`}>
                      <Icon size={24} className="text-on-primary" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary dark:text-text-inverse mb-1">{stat.value}</p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="group bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all"
                  >
                    <div className="h-1 bg-primary group-hover:scale-x-110 transition-transform"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 drak:bg-primary/20 rounded-lg flex items-center justify-center">
                          <Folder className="text-primary" size={24} />
                        </div>
                        <button
                          onClick={() => deleteCategory(category._id)}
                          disabled={deleteLoading === category._id}
                          className="p-2 text-error hover:bg-error/10 hover:text-error-dark rounded-lg transition-all disabled:opacity-50"
                        >
                          {deleteLoading === category._id ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary dark:text-text-inverse mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-secondary mb-4">
                        {category.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                        <span className="text-xs font-semibold text-text-secondary dark:text-text-secondary">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {category.active !== false ? "Active" : "Archived"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <FolderOpen className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
                <p className="text-lg text-text-secondary dark:text-text-secondary mb-4">
                  No categories yet. Create one to get started!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-lg transition-all"
                >
                  <Plus size={20} />
                  Create First Category
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCategories;
