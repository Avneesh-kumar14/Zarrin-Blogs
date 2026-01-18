
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8200/api/categories");
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
      const res = await fetch("http://localhost:8200/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
    if (!window.confirm("Delete this category?")) return;

    try {
      setDeleteLoading(id);
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8200/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter((c) => c._id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
            <Folder size={28} className="text-white" />
          </div>

          <div>
            <Heading type="h1" className="text-4xl font-bold text-slate-900">
              Categories
            </Heading>
            <Paragraph className="text-slate-600">
              Manage and organize your blog content
            </Paragraph>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <span className="text-emerald-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-rose-100 border border-rose-300 rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="text-rose-600" />
            <span className="text-rose-700">{error}</span>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:shadow-xl transition"
          >
            <Plus size={18} />
            Create Category
          </button>
        )}

        {/* Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-7 animate-in fade-in zoom-in">
              <div className="flex justify-between items-center mb-6">
                <Heading type="h3" className="text-xl text-slate-900">
                  New Category
                </Heading>
                <button onClick={() => setShowCreateForm(false)}>
                  <X className="text-slate-500 hover:text-slate-800" />
                </button>
              </div>

              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
          </div>
        ) : categories.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Folder size={20} className="text-indigo-600" />
                    </div>
                    <Heading type="h3" className="text-lg text-slate-900">
                      {cat.name}
                    </Heading>
                  </div>

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    disabled={deleteLoading === cat._id}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    {deleteLoading === cat._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>

                <Paragraph className="text-sm text-slate-500">
                  Used to group related blog posts.
                </Paragraph>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100">
              <Folder size={32} className="text-indigo-600" />
            </div>
            <Heading type="h3" className="text-slate-900">
              No categories yet
            </Heading>
            <Paragraph className="text-slate-600 mt-2">
              Create categories to organize your blog
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
