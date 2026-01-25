import React, { useState, useEffect } from "react";
import {
  Trash2,
  X,
  Plus,
  Folder,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import Heading from "../Common/Heading";
import Paragraph from "../Common/Paragraph";
import Alert from "../Common/Alert";
import { getApiUrl } from "../../utils/apiConfig";

const Categories = () => {
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
      const res = await fetch(getApiUrl("/api/categories"), {
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });
      if (!res.ok) throw new Error();
      setCategories(await res.json());
    } catch {
      setError("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return setError("Category name is required");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/api/categories"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: 'include', // CRITICAL: include cookies for production CORS
        body: JSON.stringify({ name: newCategory.trim() })
      });

      if (!res.ok) throw new Error();

      setCategories([...categories, await res.json()]);
      setNewCategory("");
      setShowCreateForm(false);
      setSuccess("Category created successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to create category");
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
          await fetch(getApiUrl(`/api/categories/${id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include' // CRITICAL: include cookies for production CORS
          });
          setCategories(categories.filter((c) => c._id !== id));
          setAlert({ type: 'success', message: 'Category deleted successfully!' });
        } catch {
          setAlert({ type: 'error', message: 'Delete failed' });
        } finally {
          setDeleteLoading(null);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#EC4899] shadow-lg">
            <Folder size={32} className="text-white" />
          </div>

          <div>
            <Heading type="h1" className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent text-4xl md:text-5xl font-bold">
              Categories
            </Heading>
            <Paragraph className="text-slate-600 dark:text-slate-400 text-lg">
              Organize and manage your content collections
            </Paragraph>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E23DA5] text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} /> New Category
          </button>
        </div>

        {/* Error and Success Messages */}
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={alert.isConfirmation ? 0 : 4000}
            isConfirmation={alert.isConfirmation}
            onConfirm={alert.onConfirm}
            onCancel={() => setAlert(null)}
          />
        )}
        {error && !alert && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}
        {success && !alert && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2"><CheckCircle size={20} /> {success}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={addCategory}
                className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-slate-700 border-t-[#6366F1]"></div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading categories...</p>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => {
              const gradients = [
                "from-[#6366F1] to-[#8B5CF6]",
                "from-[#EC4899] to-[#F472B6]",
                "from-[#06B6D4] to-[#6366F1]",
                "from-[#FB923C] to-[#FBBF24]"
              ];
              return (
                <div
                  key={category._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-slate-700 p-6 transition-all transform hover:scale-105 group"
                >
                  <div className={`h-1 bg-gradient-to-r ${gradients[idx % 4]} rounded-full mb-4`}></div>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold bg-gradient-to-r ${gradients[idx % 4]} bg-clip-text text-transparent mb-2`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {category.blogs?.length || 0} articles
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      disabled={deleteLoading === category._id}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                    >
                      {deleteLoading === category._id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <Folder size={48} className="mx-auto text-slate-400 mb-4" />
            <Heading type="h3" className="text-slate-900 dark:text-white mb-2">
              No categories yet
            </Heading>
            <Paragraph className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first category to organize your blogs
            </Paragraph>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Plus size={20} /> Create Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
